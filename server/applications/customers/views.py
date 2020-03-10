from rest_framework import viewsets, permissions

from applications.customers.serializers import CustomerSerializer
from applications.customers.models import Customer


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
