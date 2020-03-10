from rest_framework import viewsets, filters, generics, permissions, pagination
from django_filters.rest_framework import DjangoFilterBackend

from applications.accounts.filters import TransactionFilterSet, ProfileFilterSet
from applications.accounts.models import User, Fine, Bounty, Profile, Weekend
from applications.accounts.serializers import (
    UserSerializer, FineSerializer, BountySerializer, ProfileSerializer,
    WeekendSerializer,
    UserPasswordSerializer,
    TransactionSerializer,
)
from applications.motivations.models import Transaction
from shared.permissions import IsMeOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True)
    permission_classes = (IsMeOrReadOnly,)

    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filter_fields = ('profile__parlor', 'profile__role',)
    search_fields = ('last_name', 'phone_number',)


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.filter(is_active=True)
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProfileFilterSet


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class AbstractPaymentEntityViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = (
        'employee_id',
        'employee__parlor',
        'employee__user',
        'status',
        'created_at',
        'amount',
        'type',
        'month',
        'year',
    )


class FineViewSet(AbstractPaymentEntityViewSet):
    serializer_class = FineSerializer
    queryset = Fine.objects.all()


class BountyViewSet(AbstractPaymentEntityViewSet):
    serializer_class = BountySerializer
    queryset = Bounty.objects.all()


class WeekendViewSet(viewsets.ModelViewSet):
    serializer_class = WeekendSerializer
    queryset = Weekend.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = (
        'employee_id',
        'employee__parlor',
        'employee__user',
        'date',
    )


class UserPasswordUpdateView(generics.UpdateAPIView):
    serializer_class = UserPasswordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

    filter_backends = (DjangoFilterBackend,)
    filterset_class = TransactionFilterSet

    pagination_class = pagination.LimitOffsetPagination
