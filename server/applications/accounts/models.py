from cacheops import cached
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.indexes import BrinIndex
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Sum
from django.db.transaction import atomic
from django.contrib.auth.models import (
    AbstractUser,
    UserManager as NativeUserManager,
    Group as NativeGroup,
)
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from djmoney.money import Money
from djmoney.models.fields import MoneyField
from model_utils import Choices

from applications.accounts.choices import ROLE_CHOICES
from phonenumber_field.modelfields import PhoneNumberField

__all__ = (
    'User',
    'Profile',
    'Fine',
    'Bounty',
    'Weekend',
    'Group'
)


class Group(NativeGroup):
    class Meta:
        proxy = True
        verbose_name = _('group')
        verbose_name_plural = _('groups')


class UserManager(NativeUserManager):
    pass


class User(AbstractUser):
    first_name = models.CharField(
        _("First name"),
        max_length=144,
    )

    middle_name = models.CharField(
        _("Middle name"),
        max_length=144,
        blank=True,
    )

    last_name = models.CharField(
        _("Last name"),
        max_length=144,
        blank=True,
    )

    banned = models.BooleanField(
        _("Заблокирован"),
        default=False,
    )

    phone_number = PhoneNumberField(
        _("Phone number"),
        null=True,
        blank=True,
    )

    birth_date = models.DateField(
        _("Date of Birth"),
        null=True,
        blank=True,
    )

    avatar = models.ImageField(
        _("Avatar"),
        upload_to='users/avatars',
        null=True,
        blank=True,
    )

    objects = UserManager()

    def __str__(self):
        return self.get_full_name()

    @cached(timeout=10 * 60)
    def get_full_name(self):
        full_name = '%s %s %s' % (
            self.first_name, self.middle_name, self.last_name
        )
        return full_name.strip() or self.username

    class Meta:
        verbose_name = _("employee")
        verbose_name_plural = _("Employees")


class Profile(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name=_("User"),
    )

    parlor = models.ForeignKey(
        'parlors.Parlor',
        on_delete=models.CASCADE,
        related_name='users',
    )

    role = models.CharField(
        _("Role"),
        max_length=32,
        choices=ROLE_CHOICES,
        null=True,
    )

    is_active = models.BooleanField(
        _("Is active?"),
        default=True,
    )

    def get_balance(self):
        return self.transactions.aggregate(total=Sum("amount")).get('total', 0)

    def __str__(self):
        return f"[{self.parlor}] {self.user}"

    class Meta:
        unique_together = (('user', 'parlor'),)
        verbose_name = _("Profile")
        verbose_name_plural = _("Profile")


def current_month():
    return timezone.now().month


def current_year():
    return timezone.now().year


class AbstractPaymentEntity(models.Model):

    @property
    def INDICATOR(self):
        raise NotImplementedError

    def __init__(self, *args, **kwargs):
        super(AbstractPaymentEntity, self).__init__(*args, **kwargs)

    STATUSES = Choices(
        (None, 'pending', _("Pending")),
        (True, 'payed', _("Payed")),
        (False, 'canceled', _("Canceled"))
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        db_index=False,
        related_name='created_%(model_name)s',
        null=True,
        blank=True,
        verbose_name=_("Created by"),
    )
    created_at = models.DateTimeField(
        _('Created at'),
        default=timezone.now,
    )

    month = models.PositiveSmallIntegerField(
        _("Month"),
        default=current_month,
        validators=(MinValueValidator(1), MaxValueValidator(12),),
    )

    year = models.PositiveSmallIntegerField(
        _("Year"),
        default=current_year,
    )

    employee = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="%(model_name)s",
        verbose_name=_("Employee"),
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

    href = models.URLField(
        _("URL"),
        blank=True,
        null=True,
    )

    status = models.NullBooleanField(
        _("Status"),
        choices=STATUSES,
        default=STATUSES.pending,
    )
    status_changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        db_index=False,
        related_name='changed_%(model_name)s',
        null=True,
        blank=True,
        verbose_name=_("Status changed by"),
    )
    status_changed_at = models.DateTimeField(
        _("Status changed at"),
        auto_now=True
    )
    status_change_reason = models.TextField(
        _("Status change reason"),
        default="",
        blank=True,
    )

    @atomic
    def delete(self, using=None, keep_parents=False):
        self.transaction.delete()
        return super(AbstractPaymentEntity, self).delete(using, keep_parents)

    @property
    def transaction(self):
        from applications.motivations.models import Transaction

        ctype = ContentType.objects.get_for_model(self.__class__)
        try:
            return Transaction.objects.get(entity_type=ctype, entity_id=self.id)
        except Transaction.DoesNotExist:
            return None

    @classmethod
    @atomic
    def proceed_status(
            cls,
            entity_pk,
            status,
            user,
            timestamp,
            status_change_reason=None,
    ):
        from applications.motivations.models import Transaction

        entries = cls.objects.select_for_update().filter(pk=entity_pk)

        if (entity := entries.first()) is not None:

            assert entity.status != status, "Status has not been changed"

            entity.status = status
            entity.status_changed_by = user
            entity.status_changed_at = timestamp

            if status_change_reason is None:
                status_change_reason = ""

            entity.status_change_reason = status_change_reason
            entity.save(update_fields=[
                'status',
                'status_changed_by',
                'status_changed_at',
                'status_change_reason'
            ])

            _transaction = entity.transaction
            if status == cls.STATUSES.pending and _transaction:
                _transaction.delete()
            elif status == cls.STATUSES.payed:
                transaction_amount = cls.INDICATOR * entity.amount
                Transaction.create_transaction(
                    transaction_purpose_pk=entity.employee_id,
                    amount=transaction_amount,
                    created_by=user,
                    entity_object=entity,
                    reference=f"Выдача {entity._meta.verbose_name} №{entity.pk}"
                )

            return entity
        else:
            raise cls.DoesNotExist

    @classmethod
    def proceed_payed(cls, entity_pk, user, timestamp):
        return cls.proceed_status(
            entity_pk, cls.STATUSES.payed, user, timestamp
        )

    @classmethod
    def proceed_canceled(cls, entity_pk, user, timestamp, reason):
        return cls.proceed_status(
            entity_pk, cls.STATUSES.canceled, user, timestamp, reason
        )

    @classmethod
    def proceed_rollback(cls, entity_pk, user, timestamp):
        return cls.proceed_status(
            entity_pk, cls.STATUSES.pending, user, timestamp
        )

    class Meta:
        abstract = True


class Fine(AbstractPaymentEntity):
    INDICATOR = -1

    type = models.ForeignKey(
        'core.FineType',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='fines',
        verbose_name=_("Type"),
    )

    class Meta:
        ordering = ('-created_at',)
        verbose_name = _("fine")
        verbose_name_plural = _("fines")
        indexes = (BrinIndex(fields=['created_at']),)


class Bounty(AbstractPaymentEntity):
    INDICATOR = 1

    type = models.ForeignKey(
        'core.BountyType',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bounties',
        verbose_name=_("Type")
    )

    class Meta:
        ordering = ('-created_at',)
        verbose_name = _("bounty")
        verbose_name_plural = _("bounties")
        indexes = (BrinIndex(fields=['created_at']),)


class Weekend(models.Model):
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        db_index=False,
        null=True,
        blank=True,
        verbose_name=_("Created by")
    )
    created_at = models.DateTimeField(
        _("Created at"),
        default=timezone.now
    )

    employee = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='weekends',
        verbose_name=_("Employee")
    )
    date = models.DateField(
        _("Date"),
    )
    from_time = models.TimeField(
        _("From")
    )
    to_time = models.TimeField(
        _("To")
    )

    class Meta:
        verbose_name = _("weekend")
        verbose_name_plural = _("weekends")
        indexes = (BrinIndex(fields=['date']),)
