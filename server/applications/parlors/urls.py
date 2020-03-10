from rest_framework import routers

from applications.parlors.views import ParlorViewSet, ParlorTransactionViewSet

router = routers.SimpleRouter()

router.register('parlors', ParlorViewSet, basename="parlors")
router.register('parlors-transactions', ParlorTransactionViewSet, basename="parlor-transactions")

urlpatterns = router.urls
