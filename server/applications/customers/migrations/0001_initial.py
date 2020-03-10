# Generated by Django 3.0.3 on 2020-02-28 12:16

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        ('broadcasts', '0001_initial'),
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Created at')),
                ('full_name', models.CharField(max_length=144, verbose_name='Full name')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Email')),
                ('birth_date', models.DateField(blank=True, null=True, verbose_name='Birth date')),
                ('note', models.TextField(blank=True, verbose_name='Note')),
                ('created_by', models.ForeignKey(blank=True, db_index=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_customers', to='accounts.Profile', verbose_name='Created by')),
                ('find_out', models.ForeignKey(blank=True, db_index=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='customers', to='core.FindOutType', verbose_name='Find out')),
                ('phone', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='customer', to='broadcasts.Phone', verbose_name='Phone number')),
            ],
            options={
                'verbose_name': 'customer',
                'verbose_name_plural': 'customers',
            },
        ),
    ]