from rest_framework import viewsets, permissions

from applications.core.models import (
    BountyType,
    FineType,
    SessionType,
    FindOutType,
    ExpenseType,
)
from applications.core.serializers import (
    BountyTypeSerializer,
    FineTypeSerializer,
    SessionTypeSerializer,
    FindOutTypeSerializer,
    ExpenseTypeSerializer,
)


class BountyTypeViewSet(viewsets.ModelViewSet):
    serializer_class = BountyTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = BountyType.objects.all()


class FineTypeViewSet(viewsets.ModelViewSet):
    serializer_class = FineTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FineType.objects.all()


class SessionTypeViewSet(viewsets.ModelViewSet):
    serializer_class = SessionTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = SessionType.objects.all()


class FindOutTypeViewSet(viewsets.ModelViewSet):
    serializer_class = FindOutTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = FindOutType.objects.all()


class ExpenseTypeViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ExpenseType.objects.all()
