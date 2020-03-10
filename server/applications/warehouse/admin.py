from django.contrib import admin
from django.forms import BaseInlineFormSet

from applications.motivations.admin import DefaultStoreMotivationInline
from applications.warehouse.models import Category, Item, DefaultConsumable, Consumable
from shared.admin import CompactInline


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    inlines = [DefaultStoreMotivationInline]


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_filter = ('category',)
    search_fields = ('name',)


class DefaultConsumableInline(CompactInline):
    model = DefaultConsumable
    fk_name = 'session_type'
    extra = 0


class ConsumableInlineFormSet(BaseInlineFormSet):
    def save_new(self, form, commit=True):
        new_instance = super(ConsumableInlineFormSet, self).save_new(form, commit=False)
        return Consumable.create_consumable(
            record=new_instance.record,
            item=new_instance.item,
            value=new_instance.value,
            created_by=self.user,
        )

    def save_existing(self, form, instance, commit=True):
        old_value = instance.value
        new_instance: Consumable = super(ConsumableInlineFormSet, self).save_existing(form, instance, commit=True)
        return new_instance.update_warehouse(old_value)


class ConsumableInline(CompactInline):
    model = Consumable
    formset = ConsumableInlineFormSet
    fk_name = 'record'
    extra = 0

    def get_formset(self, request, obj=None, **kwargs):
        formset = super(ConsumableInline, self).get_formset(request, obj, **kwargs)
        setattr(formset, "user", request.user)
        return formset
