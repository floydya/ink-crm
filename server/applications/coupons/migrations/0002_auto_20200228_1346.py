# Generated by Django 3.0.3 on 2020-02-28 13:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('coupons', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='coupon',
            name='code',
            field=models.CharField(db_index=True, default=django.utils.timezone.now, max_length=64, unique=True, verbose_name='Code'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='coupon',
            name='type',
            field=models.CharField(choices=[('gift', 'Gift'), ('discount', 'Discount')], db_index=True, max_length=10, verbose_name='Type'),
        ),
    ]
