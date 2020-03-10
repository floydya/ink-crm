from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from applications.expenses.models import Expense
from applications.expenses.serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('parlor', 'type')
