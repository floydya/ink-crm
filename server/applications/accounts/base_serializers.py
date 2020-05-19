from rest_framework import serializers

from applications.accounts.models import User


class UsernameSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name')

    class Meta:
        model = User
        fields = ('id', 'first_name', 'middle_name', 'last_name', 'full_name', 'phone_number')
        read_only_fields = fields
