from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, pagination

from applications.notifications.models import Notification
from applications.notifications.serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Notification.objects.all()
    pagination_class = pagination.LimitOffsetPagination
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('recipient',)
