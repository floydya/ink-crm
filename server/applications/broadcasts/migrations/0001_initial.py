# Generated by Django 2.2.9 on 2020-02-10 11:23

import applications.broadcasts.models
from django.db import migrations, models
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Configuration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('verification_sms_template', models.CharField(default='Your pin code: {code}', help_text='\n            Переменные: code. Использование: {название_переменной}. <br> \n            Пример: "Ваш пин код: {code}."\n        ', max_length=256, verbose_name='Verification sms template')),
            ],
            options={
                'verbose_name': 'broadcast configuration',
                'verbose_name_plural': 'broadcast configuration',
            },
        ),
        migrations.CreateModel(
            name='Phone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', phonenumber_field.modelfields.PhoneNumberField(db_index=True, max_length=128, region=None, unique=True, verbose_name='Phone number')),
                ('verification_code', models.CharField(default=applications.broadcasts.models.generate_pin_code, max_length=4, verbose_name='Verification code')),
                ('generated_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Code generated at')),
                ('confirmed', models.BooleanField(default=False, verbose_name='Phone confirmed?')),
            ],
            options={
                'verbose_name': 'phone number',
                'verbose_name_plural': 'phone numbers',
            },
        ),
    ]
