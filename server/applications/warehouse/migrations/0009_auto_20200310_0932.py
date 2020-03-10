# Generated by Django 3.0.3 on 2020-03-10 09:32

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0008_auto_20200309_1414'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consumable',
            name='value',
            field=models.DecimalField(decimal_places=2, max_digits=14, validators=[django.core.validators.MinValueValidator(0)], verbose_name='Value'),
        ),
        migrations.AlterField(
            model_name='defaultconsumable',
            name='value',
            field=models.DecimalField(decimal_places=2, max_digits=14, validators=[django.core.validators.MinValueValidator(0)], verbose_name='Value'),
        ),
    ]
