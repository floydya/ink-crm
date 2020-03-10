import django_filters

from applications.coupons.models import Coupon


class CouponFilterSet(django_filters.FilterSet):

    code = django_filters.CharFilter(method='get_not_used_coupons')

    def get_not_used_coupons(self, queryset, name, value):
        return queryset.filter(**{
            name: value,
            "record__isnull": True
        })

    class Meta:
        model = Coupon
        fields = ('code', 'type', 'parlor',)
