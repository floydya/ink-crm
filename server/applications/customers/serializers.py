from rest_framework import serializers

from applications.accounts.models import Profile
from applications.accounts.serializers import ProfileUsernameSerializer
from applications.broadcasts.models import Phone
from applications.broadcasts.serializers import PhoneSerializer
from applications.core.models import FindOutType
from applications.core.serializers import FindOutTypeSerializer
from applications.customers.models import Customer
from applications.parlors.serializers import ParlorSerializer
from applications.records.models import Record
from shared.serializers import PrimaryKeyField


class BasicRecordSerializer(serializers.ModelSerializer):
    parlor = ParlorSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Record
        fields = ('id', 'status', 'status_display', 'parlor', 'datetime')
        read_only_fields = fields


class CustomerSerializer(serializers.ModelSerializer):
    phone = PrimaryKeyField(
        model=Phone,
        serializer=PhoneSerializer,
        queryset=Phone.objects.all()
    )
    created_by = PrimaryKeyField(
        model=Profile,
        serializer=ProfileUsernameSerializer,
        queryset=Profile.objects.all()
    )
    find_out = PrimaryKeyField(
        model=FindOutType,
        serializer=FindOutTypeSerializer,
        queryset=FindOutType.objects.all()
    )

    records = BasicRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = (
            'id',
            'phone',
            'created_by',
            'created_at',
            'full_name',
            'email',
            'find_out',
            'birth_date',
            'note',
            'records',
        )
        read_only_fields = ('id', 'created_at',)
