from django.contrib import admin

from applications.customers.models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'phone', 'full_name',)
    search_fields = ('id', 'phone__number', 'full_name',)
