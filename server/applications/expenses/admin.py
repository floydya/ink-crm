from django.contrib import admin

from jet.filters import DateRangeFilter

from applications.expenses.models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'parlor', 'amount', 'created_at', 'payed')
    read_only_fields = ('payed_amount', 'payed')
    list_filter = ('type', 'parlor', ('created_at', DateRangeFilter),)
