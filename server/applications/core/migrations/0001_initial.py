# Generated by Django 3.0.3 on 2020-02-28 12:15

from decimal import Decimal
from django.db import migrations, models
import djmoney.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BountyType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=144, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'bounty type',
                'verbose_name_plural': 'bounty types',
            },
        ),
        migrations.CreateModel(
            name='FindOutType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=144, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'find out type',
                'verbose_name_plural': 'find out types',
            },
        ),
        migrations.CreateModel(
            name='FineType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=144, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'fine type',
                'verbose_name_plural': 'fine types',
            },
        ),
        migrations.CreateModel(
            name='SessionType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=144, verbose_name='Name')),
                ('price_per_hour_currency', djmoney.models.fields.CurrencyField(choices=[('UAH', 'UAH ₴')], default='UAH', editable=False, max_length=3)),
                ('price_per_hour', djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), help_text='\n            Если установить эту сумму, система посчитает количество часов,\n            затраченных на сеанс и сравнит со стоимостью. <br>\n            При несоответствии - создаст <u>исключение</u> в журнал. <br>\n            Чтобы не включать эту опцию - оставьте <b>0</b> в поле.\n        ', max_digits=14, verbose_name='Minimal price per hour')),
                ('only_one_per_master', models.BooleanField(default=True, help_text='\n            Если включить эту опцию - нельзя будет начать второй сеанс при активном сеанса этого типа.\n        ')),
                ('approximate_time', models.TimeField(default='01:00')),
            ],
            options={
                'verbose_name': 'session type',
                'verbose_name_plural': 'session types',
            },
        ),
    ]
