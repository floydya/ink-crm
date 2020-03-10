from rest_framework import viewsets, permissions

from applications.records.models import Prepayment, Record
from applications.records.serializers import PrepaymentSerializer, RecordSerializer


class PrepaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PrepaymentSerializer
    queryset = Prepayment.objects.all()
    permission_classes = (permissions.IsAuthenticated,)


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecordSerializer
    queryset = Record.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
