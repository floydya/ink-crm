from rest_framework import routers

from applications.expenses.views import ExpenseViewSet

router = routers.SimpleRouter()

router.register('expenses', ExpenseViewSet, basename="expenses")

urlpatterns = router.urls
