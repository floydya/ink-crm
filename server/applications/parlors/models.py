from django.db import models
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from shared.models import AbstractTransaction


class Parlor(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=64,
    )

    phone_number = PhoneNumberField(
        _("Phone number"),
        null=True,
        blank=True,
    )

    certificate_prefix = models.CharField(
        _("Certificate prefix"),
        max_length=8,
        help_text=_("Max 8 symbols. E.g. if prefix is equal to 'UA', certificate number will be like: UA000001."),
    )

    class Meta:
        verbose_name = _("parlor")
        verbose_name_plural = _("parlors")

    def __str__(self):
        return self.name

    @property
    def balance(self):
        return Transaction.objects.aggregate(total=models.Sum('amount')).get('total', 0) or 0

    def create_transaction(self, amount, created_by=None, reference=None, entity_object=None):
        return Transaction.create_transaction(
            transaction_purpose_pk=self.pk,
            amount=amount,
            created_by=created_by,
            reference=reference,
            entity_object=entity_object,
        )


class Transaction(AbstractTransaction):
    purpose_model = Parlor

    purpose = models.ForeignKey(
        purpose_model,
        on_delete=models.PROTECT,
        related_name='transactions',
        verbose_name=_("Parlor"),
    )

    class Meta:
        verbose_name = _("transaction")
        verbose_name_plural = _("transactions")
