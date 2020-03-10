from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _

from applications.accounts.choices import ROLE_CHOICES
from applications.core.models import SessionType
from applications.motivations.managers import MotivationManager


class UpdatedByMixin(models.Model):
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=False,
        verbose_name=_("Updated by"),
    )

    class Meta:
        abstract = True


class BasePercentMixin(models.Model):
    base_percent = models.PositiveSmallIntegerField(
        _("Base percent"),
        default=0,
        validators=(
            MinValueValidator(0),
            MaxValueValidator(100),
        ),
    )

    class Meta:
        abstract = True


class InvitePercentMixin(BasePercentMixin):
    invite_percent = models.PositiveSmallIntegerField(
        _("Invite percent"),
        default=0,
        validators=(
            MinValueValidator(0),
            MaxValueValidator(100),
        ),
    )

    class Meta:
        abstract = True


class AbstractMotivation(UpdatedByMixin, InvitePercentMixin, models.Model):
    session_type = models.ForeignKey(
        SessionType,
        on_delete=models.CASCADE,
        db_index=False,
        verbose_name=_("Session type"),
    )

    objects = MotivationManager()

    class Meta:
        abstract = True

    def __str__(self):
        return self.session_type.name

    def clean(self):
        if self.base_percent + self.invite_percent > 100:
            raise ValidationError(
                _("Сумма базового процента и процента за приглашение не должна превышать 100.")
            )

    def get_percent(self, performer, invited_by):

        if self.employee == performer == invited_by:
            return Decimal(self.base_percent + self.invite_percent) / Decimal(100)
        elif self.employee == performer:
            return Decimal(self.base_percent) / Decimal(100)
        elif self.employee == invited_by:
            return Decimal(self.invite_percent) / Decimal(100)
        return 0


class AbstractDefaultSessionTypeMotivation(InvitePercentMixin, models.Model):
    role = models.CharField(
        _("Role"),
        choices=ROLE_CHOICES,
        max_length=32
    )

    def __str__(self):
        return self.get_role_display()

    class Meta:
        abstract = True
