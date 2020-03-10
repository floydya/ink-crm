import django_filters

from applications.motivations.models import Transaction
from applications.accounts.models import Profile
from shared.models import TransactionFilterSet as NativeTransactionFilterSet


class TransactionFilterSet(NativeTransactionFilterSet):
    class Meta:
        model = Transaction
        fields = (
            'created_at',
            'transaction_type',
            'purpose_id',
            'entity_type_id',
            'entity_id',
        )


class ProfileFilterSet(django_filters.FilterSet):

    session_type = django_filters.NumberFilter(method='session_type_filter')

    class Meta:
        model = Profile
        fields = (
            'parlor',
            'role',
            'user',
            'session_type',
        )
    
    def session_type_filter(self, queryset, name, value):
        return queryset.filter(session_motivations__session_type_id=value)
