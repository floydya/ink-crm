# Generated by Django 3.0.3 on 2020-03-02 09:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
        ('warehouse', '0005_auto_20200228_1455'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='defaultconsumable',
            options={'verbose_name': 'default consumable', 'verbose_name_plural': 'default consumables'},
        ),
        migrations.AlterUniqueTogether(
            name='defaultconsumable',
            unique_together={('session_type', 'item')},
        ),
    ]
