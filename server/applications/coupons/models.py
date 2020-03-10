from django.conf import settings
from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField

from model_utils import Choices

from applications.parlors.models import Transaction
from shared.models import TransactionMixin


class Coupon(TransactionMixin, models.Model):
    transaction_class = Transaction

    TYPE_CHOICES = Choices(
        ('gift', _("Gift")),
        ('discount', _("Discount")),
    )
    type = models.CharField(
        _("Type"),
        max_length=10,
        db_index=True,
        choices=TYPE_CHOICES,
    )

    code = models.CharField(
        _("Code"),
        max_length=64,
        unique=True,
        db_index=True,
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
        related_name='created_coupons',
        verbose_name=_("Created by"),
    )

    parlor = models.ForeignKey(
        settings.PARLOR_MODEL,
        on_delete=models.PROTECT,
        related_name='coupons',
        verbose_name=_("Parlor"),
    )

    denomination = MoneyField(
        _("Denomination"),
        max_digits=14,
        decimal_places=2,
    )

    comment = models.TextField(
        _("Comment"),
        blank=True,
    )

    class Meta:
        verbose_name = _("coupon")
        verbose_name_plural = _("coupons")

    @property
    def is_used(self):
        return self.records.exists()

    def create_transaction(self):
        if self.type == self.TYPE_CHOICES.gift:
            Transaction.create_transaction(
                transaction_purpose_pk=self.parlor_id,
                amount=self.denomination,
                created_by=self.created_by,
                reference=f"Сертификат №{self.id}",
                entity_object=self,
            )
        return self

    @staticmethod
    def generate_coupon_code(parlor):
        coupons_counter = Coupon.objects.filter(parlor=parlor).count()
        return "{}{:08}".format(parlor.certificate_prefix, coupons_counter+1)

    @classmethod
    @transaction.atomic
    def create_coupon(cls, type, parlor, denomination, created_by=None):
        code = cls.generate_coupon_code(parlor)
        return cls.objects.create(
            type=type,
            code=code,
            parlor=parlor,
            denomination=denomination,
            created_by=created_by,
        ).create_transaction()

    def post_save(self):
        _transaction: Transaction = self.transaction
        if self.type == self.TYPE_CHOICES.gift and not _transaction:
            return self.create_transaction()
        elif self.type == self.TYPE_CHOICES.discount and _transaction:
            _transaction.delete()
        return self
