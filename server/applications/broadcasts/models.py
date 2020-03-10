import random
import string

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from phonenumber_field.modelfields import PhoneNumberField
from solo.models import SingletonModel

PIN_CODE_LENGTH = 4
ALLOW_REGENERATE_AFTER = 4


def generate_pin_code():
    return ''.join(random.choice(string.digits) for x in range(PIN_CODE_LENGTH))


class Configuration(SingletonModel):

    verification_sms_template = models.CharField(
        _("Verification sms template"),
        max_length=256,
        default="Your pin code: {code}",
        help_text="""
            Переменные: code. Использование: {название_переменной}. <br> 
            Пример: "Ваш пин код: {code}."
        """
    )

    class Meta:
        verbose_name = _("broadcast configuration")
        verbose_name_plural = verbose_name


class Phone(models.Model):

    number = PhoneNumberField(
        _("Phone number"),
        unique=True,
        db_index=True
    )

    verification_code = models.CharField(
        _("Verification code"),
        max_length=PIN_CODE_LENGTH,
        default=generate_pin_code,
    )
    generated_at = models.DateTimeField(
        _("Code generated at"),
        default=timezone.now,
    )

    confirmed = models.BooleanField(
        _("Phone confirmed?"),
        default=False,
    )

    class Meta:
        verbose_name = _("phone number")
        verbose_name_plural = _("phone numbers")

    def get_new_pin_code(self):
        diff = timezone.now() - self.generated_at

        if diff.total_seconds() > ALLOW_REGENERATE_AFTER * 60 * 60:
            self.verification_code = generate_pin_code()
            self.generated_at = timezone.now()
            self.save(update_fields=['verification_code', 'generated_at'])

        return self.verification_code

    def render_verification_sms_template(self):
        return Configuration.get_solo().verification_sms_template.format(
            code=self.verification_code,
        )

    def __str__(self):
        return str(self.number)
