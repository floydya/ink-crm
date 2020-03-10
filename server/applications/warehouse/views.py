from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from applications.warehouse.models import (
    Category, 
    Item, 
    Warehouse,
    Consumable,
)
from applications.warehouse.serializers import (
    CategorySerializer, 
    ItemSerializer, 
    WarehouseSerializer,
    ConsumableSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    permission_classes = (permissions.IsAuthenticated,)


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    permission_classes = (permissions.IsAuthenticated,)


class WarehouseViewSet(viewsets.ModelViewSet):
    serializer_class = WarehouseSerializer
    queryset = Warehouse.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('parlor', 'item')


class ConsumableViewSet(viewsets.ModelViewSet):
    serializer_class = ConsumableSerializer
    queryset = Consumable.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('record', 'item', 'record__parlor',)
