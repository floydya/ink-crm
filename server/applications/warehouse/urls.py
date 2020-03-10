from django.urls import path, include

from rest_framework import routers

from applications.warehouse.views import (
    CategoryViewSet, 
    ItemViewSet, 
    WarehouseViewSet, 
    ConsumableViewSet,
)

router = routers.SimpleRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('items', ItemViewSet, basename='items')
router.register('warehouses', WarehouseViewSet, basename='warehouses')
router.register('consumables', ConsumableViewSet, basename='consumables')

urlpatterns = [
    path('store/', include(router.urls))
]
