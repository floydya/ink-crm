# Generated by Django 3.0.3 on 2020-03-11 07:44

from django.db import migrations


def create_basic_expense_types(apps, schema):

    ExpenseType = apps.get_model('core', 'ExpenseType')
    types = [
        ExpenseType(name="Зарплата", slug="salary"),
        # Todo: add expense types
    ]
    return ExpenseType.objects.bulk_create(types)


def reverse_creation(apps, schema):
    ExpenseType = apps.get_model('core', 'ExpenseType')
    return ExpenseType.objects.filter(slug__isnull=False).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_expensetype_slug'),
    ]

    operations = [
        migrations.RunPython(create_basic_expense_types, reverse_code=reverse_creation)
    ]