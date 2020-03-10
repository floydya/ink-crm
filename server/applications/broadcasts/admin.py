from django.contrib import admin

from solo.admin import SingletonModelAdmin

from applications.broadcasts.models import Phone, Configuration


@admin.register(Configuration)
class ConfigurationAdmin(SingletonModelAdmin):
    pass


@admin.register(Phone)
class PhoneAdmin(admin.ModelAdmin):
    pass
