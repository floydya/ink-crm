from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


class Customer(models.Model):

    phone = models.OneToOneField(
        'broadcasts.Phone',
        on_delete=models.CASCADE,
        related_name='customer',
        verbose_name=_("Phone number"),
    )

    created_by = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.SET_NULL,
        db_index=False,
        null=True,
        blank=True,
        related_name='created_customers',
        verbose_name=_("Created by"),
    )
    created_at = models.DateTimeField(
        _("Created at"),
        default=timezone.now,
    )

    full_name = models.CharField(
        _("Full name"),
        max_length=144,
    )
    email = models.EmailField(
        _("Email"),
        null=True,
        blank=True,
    )

    find_out = models.ForeignKey(
        'core.FindOutType',
        on_delete=models.SET_NULL,
        db_index=False,
        null=True,
        blank=True,
        related_name='customers',
        verbose_name=_("Find out"),
    )

    birth_date = models.DateField(
        _("Birth date"),
        null=True,
        blank=True,
    )

    note = models.TextField(
        _("Note"),
        blank=True,
    )

    class Meta:
        verbose_name = _("customer")
        verbose_name_plural = _("customers")

    def __str__(self):
        return str(self.phone.number)
