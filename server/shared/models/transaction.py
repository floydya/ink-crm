from uuid import uuid4

from django.conf import settings
from django.contrib import admin
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models, transaction
from django.urls import reverse
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.money import Money
from jet.filters import RelatedFieldAjaxListFilter, DateRangeFilter
import django_filters
from model_utils import Choices


class TransactionFilterSet(django_filters.FilterSet):
    created_at = django_filters.IsoDateTimeFromToRangeFilter()


class TransactionAdmin(admin.ModelAdmin):
    list_filter = (
        'transaction_type',
        ('purpose', RelatedFieldAjaxListFilter),
        ('created_at', DateRangeFilter)
    )
    list_display = ('id', 'purpose', 'created_at', 'transaction_type', 'amount', 'reference')
    readonly_fields = ('get_url',)

    def get_model_perms(self, request):
        return {}

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_url(self, obj):
        url = reverse(f"admin:{obj.entity_type.app_label}_{obj.entity_type.model}_change", args=[obj.entity_id])
        return mark_safe(f'<a href="{url}" target="_blank" rel="noopener noreferrer">Перейти к объекту</a>')


class TransactionMixin(models.Model):

    @property
    def transaction_class(self):
        raise NotImplementedError

    @property
    def transaction(self):
        ctype = ContentType.objects.get_for_model(self.__class__)
        try:
            event = self.transaction_class.objects.get(entity_type__pk=ctype.id, entity_id=self.id)
        except:
            return None
        return event

    def delete(self, using=None, keep_parents=False):
        if (transaction := self.transaction) is not None:
            transaction.delete()
        super(TransactionMixin, self).delete(using, keep_parents)

    class Meta:
        abstract = True


class AbstractTransaction(models.Model):
    # @property
    # def purpose_model(self):
    #     raise NotImplementedError
    #
    # @property
    # def purpose(self):
    #     raise NotImplementedError

    TRANSACTION_TYPES = Choices(
        ('withdraw', _("Withdraw")),
        ('deposit', _("Deposit")),
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        db_index=False,
        null=True,
        blank=True,
        related_name='created_%(app_label)s_%(model_name)s',
        verbose_name=_("Created by"),
    )
    created_at = models.DateTimeField(
        _("Created at"),
        default=timezone.now,
    )

    transaction_code = models.UUIDField(
        _("Transaction code"),
        default=uuid4,
    )

    transaction_type = models.CharField(
        _("Transaction type"),
        db_index=True,
        max_length=32,
        choices=TRANSACTION_TYPES,
    )

    amount = MoneyField(
        _("Amount"),
        max_digits=14,
        decimal_places=2,
    )

    entity_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(model_name)s",
    )
    entity_id = models.PositiveIntegerField()
    entity_object = GenericForeignKey(
        'entity_type',
        'entity_id',
    )

    reference = models.TextField(
        _("Reference"),
        blank=True,
    )

    class Meta:
        abstract = True

    @classmethod
    def aggregate_sum(cls, purpose):
        total = cls.objects.select_for_update().filter(purpose=purpose).aggregate(
            total=models.Sum('amount')
        ).get('total', 0) or 0
        return Money(total, settings.DEFAULT_CURRENCY)

    @classmethod
    def create_transaction(
            cls,
            transaction_purpose_pk,
            amount,
            created_by=None,
            reference=None,
            entity_object=None,
    ):
        amount = Money(amount, settings.DEFAULT_CURRENCY)
        purpose_obj = cls.purpose_model.objects.select_for_update().filter(pk=transaction_purpose_pk).first()
        total = cls.aggregate_sum(purpose_obj)
        assert total + amount >= Money(0, settings.DEFAULT_CURRENCY), "Not enough money!"
        assert purpose_obj is not None, "Purpose object is not found"
        assert amount != Money(0, settings.DEFAULT_CURRENCY), "Amount should be not zero"

        with transaction.atomic():

            if reference is None:
                reference = ""
            if amount < Money(0, settings.DEFAULT_CURRENCY):
                transaction_type = cls.TRANSACTION_TYPES.withdraw
            elif amount > Money(0, settings.DEFAULT_CURRENCY):
                transaction_type = cls.TRANSACTION_TYPES.deposit

            transaction_obj = cls.objects.create(
                purpose=purpose_obj,
                created_by=created_by,
                transaction_type=transaction_type,
                amount=amount,
                entity_object=entity_object,
                reference=reference
            )

        return purpose_obj, transaction_obj
