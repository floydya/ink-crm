from rest_framework import routers

from applications.coupons.views import CouponViewSet

router = routers.SimpleRouter()

router.register('coupons', CouponViewSet, basename="coupons")

urlpatterns = router.urls
