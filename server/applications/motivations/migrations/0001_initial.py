# Generated by Django 3.0.3 on 2020-02-28 12:16

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import djmoney.models.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DefaultEducationMotivation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Base percent')),
                ('invite_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Invite percent')),
                ('role', models.CharField(choices=[('owner', 'Owner'), ('director', 'Director'), ('administrator', 'Administrator'), ('master', 'Master')], max_length=32, verbose_name='Role')),
            ],
            options={
                'verbose_name': 'default education motivation',
                'verbose_name_plural': 'default educations motivation',
            },
        ),
        migrations.CreateModel(
            name='DefaultSessionMotivation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Base percent')),
                ('invite_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Invite percent')),
                ('role', models.CharField(choices=[('owner', 'Owner'), ('director', 'Director'), ('administrator', 'Administrator'), ('master', 'Master')], max_length=32, verbose_name='Role')),
            ],
            options={
                'verbose_name': 'default session motivation',
                'verbose_name_plural': 'default sessions motivation',
            },
        ),
        migrations.CreateModel(
            name='DefaultStoreMotivation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Base percent')),
                ('role', models.CharField(choices=[('owner', 'Owner'), ('director', 'Director'), ('administrator', 'Administrator'), ('master', 'Master')], max_length=32, verbose_name='Role')),
            ],
            options={
                'verbose_name': 'default sell motivation',
                'verbose_name_plural': 'default sells motivation',
            },
        ),
        migrations.CreateModel(
            name='EducationMotivation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Base percent')),
                ('invite_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Invite percent')),
            ],
            options={
                'verbose_name': 'education motivation',
                'verbose_name_plural': 'education motivations',
            },
        ),
        migrations.CreateModel(
            name='SessionMotivation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Base percent')),
                ('invite_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Invite percent')),
            ],
            options={
                'verbose_name': 'session motivation',
                'verbose_name_plural': 'session motivations',
                'default_related_name': 'session_types',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Created at')),
                ('transaction_code', models.UUIDField(default=uuid.uuid4, verbose_name='Transaction code')),
                ('transaction_type', models.CharField(choices=[('withdraw', 'Withdraw'), ('deposit', 'Deposit')], db_index=True, max_length=32, verbose_name='Transaction type')),
                ('amount_currency', djmoney.models.fields.CurrencyField(choices=[('UAH', 'UAH ₴')], default='UAH', editable=False, max_length=3)),
                ('amount', djmoney.models.fields.MoneyField(decimal_places=2, max_digits=14, verbose_name='Amount')),
                ('entity_id', models.PositiveIntegerField()),
                ('reference', models.TextField(blank=True, verbose_name='Reference')),
                ('created_by', models.ForeignKey(blank=True, db_index=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_motivations_transaction', to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
                ('entity_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='motivations_transaction', to='contenttypes.ContentType')),
                ('purpose', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='transactions', to='accounts.Profile', verbose_name='Purpose')),
            ],
            options={
                'verbose_name': 'transaction',
                'verbose_name_plural': 'transactions',
                'ordering': ('-created_at',),
            },
        ),
        migrations.CreateModel(
            name='StoreMotivation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_percent', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Base percent')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sell_motivations', to='accounts.Profile', verbose_name='Motivation')),
            ],
            options={
                'verbose_name': 'store motivation',
                'verbose_name_plural': 'store motivations',
            },
        ),
    ]