from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MinValueValidator
from django.db import models, transaction
from django.utils.translation import ugettext_lazy as _

from djmoney.models.fields import MoneyField
from djmoney.money import Money


from applications.parlors.models import Transaction


class Manager(models.Manager):
    def get_queryset(self):
        ctype = ContentType.objects.get_for_model(Expense)
        transaction_subquery = Transaction.objects.filter(
            entity_type__pk=ctype.id,
            entity_id=models.OuterRef('pk'),
        ).annotate(total=models.Sum('amount')).values('total')
        return super(Manager, self).get_queryset().annotate(
            payed_amount=models.Func(models.Subquery(transaction_subquery), function='ABS')
        )


class Expense(models.Model):

    created_at = models.DateTimeField(
        _("Created at"),
        auto_now_add=True,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=False,
        related_name="created_expenses",
        verbose_name="Created by",
    )

    parlor = models.ForeignKey(
        'parlors.Parlor',
        on_delete=models.CASCADE,
        related_name="expenses",
        verbose_name=_("Parlor"),
    )

    type = models.ForeignKey(
        'core.ExpenseType',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="expenses",
        verbose_name=_("Type"),
    )

    amount = MoneyField(
        _("Amount"),
        max_digits=14,
        decimal_places=2,
        validators=(MinValueValidator(Money(0.01, settings.DEFAULT_CURRENCY)),),
    )

    note = models.TextField(
        _("Note"),
        blank=True,
    )

    image = models.ImageField(
        _("Image"),
        blank=True,
        null=True,
        upload_to="expenses",
    )

    objects = Manager()

    class Meta:
        verbose_name = _("expense")
        verbose_name_plural = _("expenses")

    @property
    def transactions(self):
        ctype = ContentType.objects.get_for_model(self.__class__)
        return Transaction.objects.filter(
            entity_type__pk=ctype.id, entity_id=self.id
        )

    @property
    def _payed_amount(self):
        return abs(self.transactions.aggregate(total=models.Sum('amount')).get('total', 0) or 0)

    @property
    def payed(self):
        return self.payed_amount == self.amount

    @classmethod
    @transaction.atomic
    def create_expense(
        cls,
        parlor,
        type,
        amount,
        payed_amount=None,
        note=None,
        image=None,
        created_by=None
    ):
        assert payed_amount <= amount, "Оплаченная сумма не может быть больше платежа."

        if note is None:
            note = ""

        expense_object = cls.objects.create(
            parlor=parlor,
            type=type,
            amount=amount,
            note=note,
            image=image,
            created_by=created_by
        )

        if payed_amount is not None:
            Transaction.create_transaction(
                transaction_purpose_pk=parlor.id,
                amount=-payed_amount,
                created_by=created_by,
                reference=f"Оплата расхода №{expense_object.id}",
                entity_object=expense_object
            )

        return expense_object

    @transaction.atomic
    def add_payment(self, amount, created_by=None):
        Transaction.create_transaction(
            transaction_purpose_pk=self.parlor.id,
            amount=amount,
            created_by=created_by,
            reference=f"Оплата расхода №{self.id}",
            entity_object=self
        )
        return self
