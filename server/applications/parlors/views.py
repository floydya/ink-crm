from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from applications.parlors.filters import TransactionFilterSet
from applications.parlors.models import Parlor, Transaction
from applications.parlors.serializers import (
    ParlorSerializer, 
    ParlorTransactionSerializer
)


class ParlorViewSet(viewsets.ModelViewSet):
    queryset = Parlor.objects.all()
    serializer_class = ParlorSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, pk=None):
        if 'balance' in request.GET:
            obj = self.get_object()
            return Response({
                "balance": obj.balance
            })
        print('balance' in request.GET)
        return super(ParlorViewSet, self).retrieve(request, pk)


class ParlorTransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = ParlorTransactionSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = TransactionFilterSet
