from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models, transaction
from django.db.models import F
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from djmoney.models.fields import MoneyField
from djmoney.money import Money


class Category(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=144,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("item category")
        verbose_name_plural = _("item categories")


class Item(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_("Category"),
    )

    name = models.CharField(
        _("Name"),
        max_length=144,
    )
    units = models.CharField(
        _("Units of measure"),
        max_length=144,
    )

    purchase_price = MoneyField(
        _("Цена закупки"),
        validators=(MinValueValidator(Money(0.01, currency=settings.DEFAULT_CURRENCY)),),
        max_digits=14,
        decimal_places=2,
        default=0,
    )
    sell_price = MoneyField(
        _("Цена продажи"),
        validators=(MinValueValidator(Money(0.01, currency=settings.DEFAULT_CURRENCY)),),
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    def __str__(self):
        return f'[{self.category}] {self.name}'

    class Meta:
        verbose_name = _("item")
        verbose_name_plural = _("items")


class DefaultConsumable(models.Model):
    session_type = models.ForeignKey(
        'core.SessionType',
        on_delete=models.CASCADE,
        db_index=False,
        related_name='default_consumables',
        verbose_name=_("Session type"),
    )

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        db_index=False,
        verbose_name=_("Item"),
    )

    value = models.DecimalField(
        _("Value"),
        max_digits=14,
        decimal_places=2,
        validators=(MinValueValidator(0.01),)
    )

    class Meta:
        unique_together = (
            ('session_type', 'item'),
        )
        verbose_name = _("default consumable")
        verbose_name_plural = _("default consumables")

    def __str__(self):
        return str(self.item.name)


class Warehouse(models.Model):
    parlor = models.ForeignKey(
        'parlors.Parlor',
        on_delete=models.CASCADE,
        related_name='warehouses',
        verbose_name=_("Parlor"),
    )

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='warehouses',
        verbose_name=_("Item"),
    )

    value = models.DecimalField(
        _("Value"),
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    @classmethod
    def get_by_parlor(cls, parlor, item, queryset=False):
        qs = cls.objects.filter(parlor=parlor, item=item)
        if queryset:
            return qs
        return qs.first()

    class Meta:
        verbose_name = _("warehouse")
        verbose_name_plural = _("warehouses")


class Consumable(models.Model):
    record = models.ForeignKey(
        'records.Record',
        on_delete=models.CASCADE,
        related_name='consumables',
        verbose_name=_("Record")
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        db_index=False,
        related_name='used_as_consumables',
        verbose_name=_("Item"),
    )
    value = models.DecimalField(
        _("Value"),
        max_digits=14,
        decimal_places=2,
        validators=(MinValueValidator(0.01),)
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=False,
        verbose_name=_("Created by")
    )
    created_at = models.DateTimeField(
        _("Created at"),
        default=timezone.now,
    )

    @classmethod
    def create_consumable(cls, record, item, value, created_by=None):

        with transaction.atomic():

            instance = cls.objects.create(
                record=record,
                item=item,
                value=value,
                created_by=created_by
            )
            Warehouse.get_by_parlor(record.parlor, item, queryset=True).update(value=F('value') - value)

            return instance

    @transaction.atomic
    def update_warehouse(self, old_value):
        Warehouse.get_by_parlor(record.parlor, item, queryset=True).update(value=F('value') + old_value - self.value)
        return self
