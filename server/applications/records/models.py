from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models, transaction
from django.db.models import Sum
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.money import Money
from model_utils import Choices
from model_utils.models import StatusModel

from applications.parlors.models import Transaction as ParlorTransaction
from applications.motivations.models import Transaction as EmployeeTransaction
from applications.warehouse.models import Consumable
from shared.models import TransactionMixin


class Record(TransactionMixin, StatusModel):
    transaction_class = ParlorTransaction

    STATUS = Choices(
        ('new', _("New")),
        ('pending', _("Pending")),
        ('in_work', _("In work")),
        ('finished', _("Finished")),
        ('canceled', _("Canceled")),
    )
    EDIT_STATUSES = [STATUS.new, STATUS.pending]
    # Status part

    created_at = models.DateTimeField(
        _("Created at"),
        default=timezone.now,
    )
    created_by = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.SET_NULL,
        db_index=False,
        null=True,
        blank=True,
        related_name='created_records',
        verbose_name=_("Created by"),
    )

    parlor = models.ForeignKey(
        settings.PARLOR_MODEL,
        on_delete=models.PROTECT,
        related_name='records',
        verbose_name=_("Parlor"),
    )

    # Record part

    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.PROTECT,
        related_name='records',
        verbose_name=_("Customer"),
    )

    performer = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='records',
        verbose_name=_("Performer"),
    )

    type = models.ForeignKey(
        'core.SessionType',
        on_delete=models.PROTECT,
        related_name='records',
        verbose_name=_("Record type"),
    )

    datetime = models.DateTimeField(
        _("Datetime"),
    )

    approximate_time = models.TimeField(
        _("Approximate time"),
        null=True,
        blank=True,
    )
    comment = models.TextField(
        _("Comment"),
        blank=True,
    )
    sketch = models.ImageField(
        _("Sketch"),
        upload_to="records/sketches",
        null=True,
        blank=True,
    )

    # Cancel

    reason = models.TextField(
        _("Cancel reason"),
        blank=True
    )
    rollback_prepayment = models.NullBooleanField(
        _("Rollback prepayment"),
        default=None,
    )

    # Questionnaire part

    price = MoneyField(
        _("Price"),
        null=True,
        blank=True,
        max_digits=14,
        decimal_places=2,
    )

    used_coupon = models.OneToOneField(
        'coupons.Coupon',
        on_delete=models.SET_NULL,
        db_index=False,
        null=True,
        blank=True,
        related_name="record",
        verbose_name=_("Used coupon")
    )

    @property
    def work_payment(self):
        try:
            return EmployeeRecordPayment.objects.get(record=self, type=EmployeeRecordPayment.TYPE_CHOICES.work)
        except EmployeeRecordPayment.DoesNotExist:
            return None

    @property
    def invite_payment(self):
        try:
            return EmployeeRecordPayment.objects.get(record=self, type=EmployeeRecordPayment.TYPE_CHOICES.invite)
        except EmployeeRecordPayment.DoesNotExist:
            return None

    def get_total_prepayments(self):
        prepayments = Prepayment.objects.filter(record=self).aggregate(total=Sum('value')).get('total', 0) or 0
        return Money(prepayments, settings.DEFAULT_CURRENCY)

    @classmethod
    def create_record(
            cls,
            parlor,
            customer,
            performer,
            type,
            datetime,
            approximate_time=None,
            comment=None,
            sketch=None,
            created_by=None,
            prepayment=None,
    ):
        status = cls.STATUS.pending
        if created_by is None:
            status = cls.STATUS.new
        if comment is None:
            comment = ""
        if approximate_time is None:
            approximate_time = type.approximate_time

        with transaction.atomic():
            record = cls.objects.create(
                status=status,
                created_by=created_by,
                parlor=parlor,
                customer=customer,
                performer=performer,
                type=type,
                datetime=datetime,
                approximate_time=approximate_time,
                comment=comment,
                sketch=sketch,
            )

            if prepayment is not None and prepayment > Money(0, settings.DEFAULT_CURRENCY):
                Prepayment.create_payment(
                    record=record,
                    created_by=created_by.user,
                    value=prepayment,
                )

            return record

    @transaction.atomic
    def start_record(self):

        self.status = self.STATUS.in_work
        self.save(update_fields=['status'])

        if (consumables := self.type.default_consumables.all()):
            for c in consumables:
                Consumable.create_consumable(
                    record=self,
                    item=c.item,
                    value=c.value
                )
        
        return self

    @transaction.atomic
    def cancel_record(self, reason, rollback_prepayment=False):
        
        self.status = self.STATUS.canceled
        self.reason = reason
        self.rollback_prepayment = rollback_prepayment

        if rollback_prepayment is True:
            for prepayment in self.prepayments.all():
                if (_transaction := prepayment.transaction) is not None:
                    _transaction.delete()
        
        self.save(update_fields=['status', 'reason', 'rollback_prepayment'])

        return self

    @transaction.atomic
    def finish_record(self, price, finished_by, used_coupon=None):

        prepayments = self.get_total_prepayments()
        denomination = (
            used_coupon.denomination 
            if used_coupon
            else 0
        )
        revenue = price - denomination - prepayments
        assert revenue >= Money(0, settings.DEFAULT_CURRENCY), "Сумма должна быть больше либо равна внесенной предоплаты и номинала купона."

        for payment in EmployeeRecordPayment.objects.filter(record=self):
            payment.delete()

        self.transaction_class.create_transaction(
            transaction_purpose_pk=self.parlor_id,
            amount=revenue,
            created_by=finished_by,
            reference=f"Закрытие записи №{self.id}",
            entity_object=self
        )

        self.status = self.STATUS.finished
        self.price = price
        self.used_coupon = used_coupon
        self.save(update_fields=['status', 'price', 'used_coupon'])

        coupon = (
            used_coupon.denomination 
            if used_coupon and used_coupon.type == used_coupon.TYPE_CHOICES.discount 
            else 0
        )
        cash_for_motivation = price - denomination

        performer_motivation = (
            self.performer
            .session_motivations
            .filter(session_type_id=self.type.id)
            .values('base_percent')
            .first()
        )
        if performer_motivation is not None:
            performer_motivation = Decimal(
                performer_motivation.get('base_percent', 0) / 100.0
            )
            perfomer_salary = cash_for_motivation * performer_motivation
            if perfomer_salary > Money(0, settings.DEFAULT_CURRENCY):
                EmployeeRecordPayment.create(
                    self, 
                    self.performer, 
                    EmployeeRecordPayment.TYPE_CHOICES.work, 
                    perfomer_salary,
                    finished_by
                )

        invite_motivation = (
            self.created_by
            .session_motivations
            .filter(session_type_id=self.type.id)
            .values('invite_percent')
            .first()
        )
        if invite_motivation is not None:
            invite_motivation = Decimal(
                invite_motivation.get('invite_percent', 0) / 100.0
            )
            invite_salary = cash_for_motivation * invite_motivation
            if invite_salary > Money(0, settings.DEFAULT_CURRENCY):
                EmployeeRecordPayment.create(
                    self, 
                    self.performer, 
                    EmployeeRecordPayment.TYPE_CHOICES.invite,
                    invite_salary,
                    finished_by
                )

        return self

    class Meta:
        permissions = (
            ('can_change_session_time', _("Can change session time")),
            ('can_cancel_session', _("Can cancel session")),
            ('can_start_session', _("Can start session")),
            ('can_finish_session', _("Can finish session")),
        )
        verbose_name = _("record")
        verbose_name_plural = _("records")


class EmployeeRecordPayment(TransactionMixin, models.Model):
    transaction_class = EmployeeTransaction

    TYPE_CHOICES = Choices(
        ('invite', _("Invite")),
        ('work', _("Work")),
    )

    type = models.CharField(
        _("Type"),
        choices=TYPE_CHOICES,
        max_length=10,
    )

    record = models.ForeignKey(
        Record,
        db_index=False,
        on_delete=models.CASCADE,
        related_name='employee_payments',
        verbose_name=_("Record"),
    )

    class Meta:
        unique_together = (
            ('type', 'record'),
        )
        verbose_name = _("employee record payment")
        verbose_name_plural = _("employee record payments")

    def __str__(self):
        return str(self.get_type_display())

    @property
    def employee(self):
        if (_transaction := self.transaction) is not None:
            return _transaction.purpose
        return None
    
    @property
    def amount(self):
        if (_transaction := self.transaction) is not None:
            return _transaction.amount
        return None

    @classmethod
    def create(cls, record, employee, type, amount, finished_by):
        assert type in cls.TYPE_CHOICES, f"Type error: ${type} not in TYPE_CHOICES"
        assert amount > Money(0, settings.DEFAULT_CURRENCY), f"Value error: amount <= 0"
        with transaction.atomic():
            instance = cls.objects.create(type=type, record=record)
            EmployeeTransaction.create_transaction(
                transaction_purpose_pk=employee.pk,
                amount=amount,
                created_by=finished_by,
                reference=f"Выплата за {instance.get_type_display()} в сеансе №{record.id}.",
                entity_object=instance,
            )
            return instance


class Prepayment(TransactionMixin, models.Model):
    transaction_class = ParlorTransaction

    record = models.ForeignKey(
        Record,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='prepayments',
        verbose_name=_("Record"),
    )

    created_at = models.DateTimeField(
        _("Created at"),
        default=timezone.now,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=False,
        related_name="created_prepayments",
        verbose_name=_("Created by"),
    )

    updated_at = models.DateTimeField(
        _("Updated at"),
        null=True,
        blank=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=False,
        related_name="updated_prepayments",
        verbose_name=_("Updated by")
    )

    value = MoneyField(
        _("Value"),
        max_digits=14,
        decimal_places=2,
        validators=(MinValueValidator(Money(0.01, currency=settings.DEFAULT_CURRENCY)),)
    )

    class Meta:
        permissions = (
            ('can_cancel_prepayment', _("Can cancel prepayment")),
        )
        verbose_name = _("prepayment")
        verbose_name_plural = _("prepayments")

    def __str__(self):
        return str(self.pk)

    @classmethod
    def create_payment(cls, record, created_by, value):
        with transaction.atomic():
            prepayment = cls.objects.create(
                record_id=record.pk,
                created_by=created_by,
                value=value,
            )

            cls.transaction_class.create_transaction(
                transaction_purpose_pk=record.parlor_id,
                amount=value,
                created_by=created_by,
                reference=f"Предоплата №{prepayment.id} к сеансу №{record.id}",
                entity_object=prepayment
            )

            return prepayment

    def update(self):
        with transaction.atomic():
            if (trans := self.transaction) is not None:
                if trans.amount != self.value:
                    trans.amount = self.value
                    trans.save(update_fields=['amount'])
        return self
