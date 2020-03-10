from django.urls import path
from rest_framework.routers import SimpleRouter

from applications.accounts.views import (
    UserViewSet,
    FineViewSet,
    BountyViewSet,
    ProfileViewSet,
    WeekendViewSet,
    TransactionListView,
)

router = SimpleRouter()

router.register('users', UserViewSet, basename="users")
router.register('profiles', ProfileViewSet, basename="profiles")
router.register('fines', FineViewSet, basename="fines")
router.register('bounties', BountyViewSet, basename="bounties")
router.register('weekends', WeekendViewSet, basename="weekends")

urls = [
    path('transactions/', TransactionListView.as_view(), name="employee-transactions"),
]

urlpatterns = router.urls + urls
