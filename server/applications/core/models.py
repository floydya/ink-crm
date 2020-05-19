from django.db import models
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField


class SessionType(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=144
    )

    price_per_hour = MoneyField(
        _("Minimal price per hour"),
        default=0,
        max_digits=14,
        decimal_places=2,
        help_text=_("""
            Если установить эту сумму, система посчитает количество часов,
            затраченных на сеанс и сравнит со стоимостью. <br>
            При несоответствии - создаст <u>исключение</u> в журнал. <br>
            Чтобы не включать эту опцию - оставьте <b>0</b> в поле.
        """)
    )
    only_one_per_master = models.BooleanField(
        _("Только один сеанс на мастера?"),
        default=True,
        help_text=_("""
            Если включить эту опцию - нельзя будет начать второй сеанс при активном сеанса этого типа.
        """)
    )
    approximate_time = models.TimeField(
        _("Примерное время на сеанс"), 
        default="01:00"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("session type")
        verbose_name_plural = _("session types")


class FineType(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=144,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("fine type")
        verbose_name_plural = _("fine types")


class BountyType(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=144,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("bounty type")
        verbose_name_plural = _("bounty types")


class FindOutType(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=144,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("find out type")
        verbose_name_plural = _("find out types")


class ExpenseType(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=144,
    )
    slug = models.SlugField(
        null=True,
        editable=False
    )

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("expense type")
        verbose_name_plural = _("expense types")
