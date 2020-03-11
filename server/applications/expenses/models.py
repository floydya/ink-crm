from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MinValueValidator
from django.db import models, transaction
from django.utils.translation import ugettext_lazy as _

from djmoney.models.fields import MoneyField
from djmoney.money import Money

from applications.expenses.managers import ExpenseManager
from applications.parlors.models import Transaction

__all__ = 'Expense',


class Expense(models.Model):

    payed_amount: 'Money'

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

    objects = ExpenseManager()

    class Meta:
        verbose_name = _("expense")
        verbose_name_plural = _("expenses")

    @property
    def transactions(self):
        content_type = ContentType.objects.get_for_model(self.__class__)
        return Transaction.objects.filter(
            entity_type__pk=content_type.id,
            entity_id=self.id
        )

    @property
    def payed(self):
        return self.payed_amount == self.amount

    @transaction.atomic
    def add_payment(self, amount, created_by=None):
        Transaction.create_transaction(
            transaction_purpose_pk=self.parlor.id,
            amount=-amount,
            created_by=created_by,
            reference=f"Оплата расхода №{self.id}",
            entity_object=self
        )
        return self
