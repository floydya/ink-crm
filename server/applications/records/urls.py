from rest_framework import routers

from applications.records.views import RecordViewSet, PrepaymentViewSet

router = routers.SimpleRouter()

router.register('prepayments', PrepaymentViewSet, basename="prepayments")
router.register('records', RecordViewSet, basename="records")

urlpatterns = router.urls
