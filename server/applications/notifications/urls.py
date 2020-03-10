from django.urls import path

from applications.notifications.views import NotificationListView

urlpatterns = [
    path(
        'notifications/',
        NotificationListView.as_view(),
        name="notification-list",
    ),
]
