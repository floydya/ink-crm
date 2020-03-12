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


@admin.register(ExpenseType)
class ExpenseTypeAdmin(TypicalCoreAdmin):

    def has_delete_permission(self, request, obj=None):
        if obj and obj.slug:
            return False
        return super(ExpenseTypeAdmin, self).has_delete_permission(request, obj)


admin.site.register([
    FineType,
    FindOutType,
    BountyType
], TypicalCoreAdmin)
