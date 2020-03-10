from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from applications.coupons.filters import CouponFilterSet
from applications.coupons.models import Coupon
from applications.coupons.serializers import CouponSerializer


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_class = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filterset_class = CouponFilterSet
