from django.contrib import admin
from django.forms import BaseInlineFormSet
from django.utils import timezone

from applications.records.models import Record, EmployeeRecordPayment, Prepayment
from applications.warehouse.admin import ConsumableInline
from shared.admin import CompactInline


class PrepaymentInlineFormSet(BaseInlineFormSet):

    def save_new(self, form, commit=True):
        new_instance = super(PrepaymentInlineFormSet, self).save_new(form, commit=False)
        return Prepayment.create_payment(
            record=new_instance.record,
            created_by=self.user,
            value=new_instance.value,
        )

    def save_existing(self, form, instance, commit=True):
        new_instance: Prepayment = super(PrepaymentInlineFormSet, self).save_existing(form, instance, commit=False)
        new_instance.updated_by = self.user
        new_instance.updated_at = timezone.now()
        new_instance.save()
        return new_instance.update()


class PrepaymentInline(CompactInline):
    model = Prepayment
    readonly_fields = ('created_at', 'created_by',)
    fk_name = "record"
    formset = PrepaymentInlineFormSet
    extra = 0

    def get_formset(self, request, obj=None, **kwargs):
        formset = super(PrepaymentInline, self).get_formset(request, obj, **kwargs)
        setattr(formset, "user", request.user)
        return formset


@admin.register(Prepayment)
class PrepaymentAdmin(admin.ModelAdmin):

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_model_perms(self, request):
        return {}


class EmployeeRecordPaymentInline(CompactInline):
    model = EmployeeRecordPayment
    fk_name = "record"
    fields = ('type', 'employee', 'amount')
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    inlines = [PrepaymentInline, EmployeeRecordPaymentInline, ConsumableInline]

    # Todo: implement save model
