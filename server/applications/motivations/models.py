from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _

from applications.accounts.choices import ROLE_CHOICES
from applications.accounts.models import Profile
from applications.motivations.base import (
    AbstractMotivation,
    UpdatedByMixin,
    AbstractDefaultSessionTypeMotivation,
    BasePercentMixin,
)
from applications.motivations.managers import MotivationManager
from shared.models import AbstractTransaction


class SessionMotivation(AbstractMotivation):
    employee = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="session_motivations",
        verbose_name=_("Motivation"),
    )

    class Meta:
        default_related_name = "session_types"
        unique_together = (
            ('employee', 'session_type'),
        )
        verbose_name = _("session motivation")
        verbose_name_plural = _("session motivations")


class EducationMotivation(AbstractMotivation):
    employee = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="education_motivations",
        verbose_name=_("Motivation"),
    )

    def __str__(self):
        return f"{super(EducationMotivation, self).__str__()} (обучение)"

    class Meta:
        unique_together = (
            ('employee', 'session_type'),
        )
        verbose_name = _("education motivation")
        verbose_name_plural = _("education motivations")


class StoreMotivation(UpdatedByMixin, BasePercentMixin, models.Model):
    employee = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sell_motivations',
        verbose_name=_("Motivation"),
    )

    sell_category = models.ForeignKey(
        'warehouse.Category',
        on_delete=models.CASCADE,
        db_index=False,
        verbose_name=_("Sell category"),
    )

    objects = MotivationManager()

    class Meta:
        unique_together = (
            ('employee', 'sell_category'),
        )
        verbose_name = _("store motivation")
        verbose_name_plural = _("store motivations")

    def __str__(self):
        return self.sell_category.name

    def get_percent(self):
        return Decimal(self.base_percent) / Decimal(100)


class Transaction(AbstractTransaction):
    purpose_model = Profile

    purpose = models.ForeignKey(
        purpose_model,
        on_delete=models.PROTECT,
        related_name='transactions',
        verbose_name=_("Purpose"),
    )

    class Meta:
        ordering = ('-created_at',)
        verbose_name = _("transaction")
        verbose_name_plural = _("transactions")


class DefaultSessionMotivation(AbstractDefaultSessionTypeMotivation):
    session_type = models.ForeignKey(
        'core.SessionType',
        on_delete=models.CASCADE,
        db_index=False,
        related_name='default_motivations',
        verbose_name=_("Session type")
    )

    class Meta:
        unique_together = (('role', 'session_type'),)
        verbose_name = _("default session motivation")
        verbose_name_plural = _("default sessions motivation")


class DefaultEducationMotivation(AbstractDefaultSessionTypeMotivation):
    session_type = models.ForeignKey(
        'core.SessionType',
        on_delete=models.CASCADE,
        db_index=False,
        related_name='default_educations',
        verbose_name=_("Education type")
    )

    class Meta:
        unique_together = (('role', 'session_type'),)
        verbose_name = _("default education motivation")
        verbose_name_plural = _("default educations motivation")


class DefaultStoreMotivation(BasePercentMixin, models.Model):
    role = models.CharField(
        _("Role"),
        choices=ROLE_CHOICES,
        max_length=32
    )

    sell_category = models.ForeignKey(
        'warehouse.Category',
        on_delete=models.CASCADE,
        db_index=False,
        verbose_name=_("Sell category"),
    )

    def __str__(self):
        return self.get_role_display()

    class Meta:
        unique_together = (('role', 'sell_category'),)
        verbose_name = _("default sell motivation")
        verbose_name_plural = _("default sells motivation")
