from django.contrib import admin

from applications.core.models import (
    FineType, 
    SessionType, 
    FindOutType, 
    BountyType,
    ExpenseType,
)
from applications.motivations.admin import (
    DefaultSessionMotivationInline, 
    DefaultEducationMotivationInline,
)
from applications.warehouse.admin import DefaultConsumableInline


class TypicalCoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(SessionType)
class SessionTypeAdmin(TypicalCoreAdmin):
    inlines = [DefaultSessionMotivationInline, DefaultEducationMotivationInline, DefaultConsumableInline]


admin.site.register([
    FineType,
    FindOutType,
    BountyType,
    ExpenseType
], TypicalCoreAdmin)
