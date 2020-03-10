from rest_framework import routers

from applications.core.views import (
    BountyTypeViewSet, 
    FineTypeViewSet, 
    SessionTypeViewSet, 
    FindOutTypeViewSet,
    ExpenseTypeViewSet,
)

router = routers.SimpleRouter()

router.register('bounties', BountyTypeViewSet, basename="bounty-types")
router.register('fines', FineTypeViewSet, basename="fine-types")
router.register('sessions', SessionTypeViewSet, basename="session-types")
router.register('find-outs', FindOutTypeViewSet, basename="find-outs")
router.register('expenses', ExpenseTypeViewSet, basename="expenses")

urlpatterns = router.urls
