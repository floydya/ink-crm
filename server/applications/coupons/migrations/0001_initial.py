# Generated by Django 3.0.3 on 2020-02-28 13:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import djmoney.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('parlors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('gift', 'Gift'), ('discount', 'Discount')], max_length=10, verbose_name='Type')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Created at')),
                ('denomination_currency', djmoney.models.fields.CurrencyField(choices=[('UAH', 'UAH ₴')], default='UAH', editable=False, max_length=3)),
                ('denomination', djmoney.models.fields.MoneyField(decimal_places=2, max_digits=14, verbose_name='Denomination')),
                ('created_by', models.ForeignKey(blank=True, db_index=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_coupons', to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
                ('parlor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='coupons', to='parlors.Parlor', verbose_name='Parlor')),
            ],
            options={
                'verbose_name': 'coupon',
                'verbose_name_plural': 'coupons',
            },
        ),
    ]
