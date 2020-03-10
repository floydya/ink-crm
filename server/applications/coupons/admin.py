from django.contrib import admin
from jet.filters import DateRangeFilter

from applications.coupons.models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'parlor', 'created_at')
    list_filter = ('parlor', ('created_at', DateRangeFilter))
    search_fields = ('id', 'code')
    readonly_fields = ('code', 'created_by', 'created_at')

    def save_model(self, request, obj, form, change):
        if not obj:
            instance = form.save(commit=False)
            Coupon.create_coupon(
                type=instance.type,
                parlor=instance.parlor,
                denomination=instance.denomination,
                created_by=request.user,
            )
        else:
            super(CouponAdmin, self).save_model(request, obj, form, change)
