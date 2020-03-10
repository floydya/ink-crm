from rest_framework import serializers

from applications.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):

    title = serializers.CharField(source='__str__')
    type = serializers.CharField(source='level')

    class Meta:
        model = Notification
        fields = ('id', 'title', 'type', 'timesince')
