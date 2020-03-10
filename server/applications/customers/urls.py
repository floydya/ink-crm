from rest_framework import routers

from applications.customers.views import CustomerViewSet

router = routers.SimpleRouter()

router.register('customers', CustomerViewSet, basename="customers")

urlpatterns = router.urls
