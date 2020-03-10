import django_filters

from applications.parlors.models import Transaction
from shared.models.transaction import TransactionFilterSet as NativeTransactionFilterSet


class TransactionFilterSet(NativeTransactionFilterSet):

    class Meta:
        model = Transaction
        fields = ('created_at', 'purpose', 'transaction_type')
