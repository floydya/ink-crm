# Generated by Django 3.0.3 on 2020-03-06 12:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coupons', '0003_coupon_comment'),
        ('records', '0006_auto_20200305_1500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='used_coupon',
            field=models.OneToOneField(blank=True, db_index=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='record', to='coupons.Coupon', verbose_name='Used coupon'),
        ),
    ]
