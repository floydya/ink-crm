from django.db.models import F
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

    def get_queryset(self):
        qs = super(ExpenseViewSet, self).get_queryset()
        if 'unpayed' in self.request.GET:
            return qs.filter(payed_amount__lt=F('amount'))
        return qs
