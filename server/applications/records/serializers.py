from django.conf import settings
from django.utils import timezone
from djmoney.contrib.django_rest_framework import MoneyField
from djmoney.money import Money
from drf_base64.fields import Base64ImageField
from rest_framework import serializers

from applications.accounts.models import Profile
from applications.accounts.serializers import UsernameSerializer, ProfileSerializer, ProfileUsernameSerializer
from applications.core.models import SessionType
from applications.core.serializers import SessionTypeSerializer
from applications.customers.models import Customer
from applications.customers.serializers import CustomerSerializer
from applications.coupons.models import Coupon
from applications.coupons.serializers import CouponSerializer
from applications.parlors.models import Parlor
from applications.parlors.serializers import ParlorSerializer
from applications.records.models import Record, Prepayment, EmployeeRecordPayment
from shared.serializers import PrimaryKeyField


class EmployeeRecordPaymentSerializer(serializers.ModelSerializer):

    employee = ProfileUsernameSerializer(read_only=True)
    amount = MoneyField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = EmployeeRecordPayment
        fields = (
            'id',
            'type',
            'employee',
            'amount',
        )
        read_only_fields = fields


class PrepaymentSerializer(serializers.ModelSerializer):
    created_by = UsernameSerializer()
    updated_by = UsernameSerializer()

    class Meta:
        model = Prepayment
        fields = (
            'id',
            'record',
            'created_at',
            'created_by',
            'updated_at',
            'updated_by',
            'value',
        )
        extra_kwargs = {
            "record": {"write_only": True},
            "created_at": {"read_only": True},
            "created_by": {"read_only": True},
            "updated_at": {"read_only": True},
            "updated_by": {"read_only": True},
        }

    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        validated_data['updated_at'] = timezone.now()
        return super(PrepaymentSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return Prepayment.create_payment(**validated_data)


class RecordSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    parlor = PrimaryKeyField(
        serializer=ParlorSerializer,
        queryset=Parlor.objects.all(),
        model=Parlor,
    )
    created_by = PrimaryKeyField(
        serializer=ProfileSerializer,
        queryset=Profile.objects.all(),
        model=Profile,
    )
    customer = PrimaryKeyField(
        serializer=CustomerSerializer,
        queryset=Customer.objects.all(),
        model=Customer,
    )
    performer = PrimaryKeyField(
        serializer=ProfileSerializer,
        queryset=Profile.objects.all(),
        model=Profile,
    )
    type = PrimaryKeyField(
        serializer=SessionTypeSerializer,
        queryset=SessionType.objects.all(),
        model=SessionType,
    )
    sketch = Base64ImageField(required=False, allow_null=True)
    prepayments = PrepaymentSerializer(many=True, read_only=True)
    prepayment = MoneyField(
        write_only=True,
        allow_null=True,
        max_digits=14,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        min_value=Money(0, currency=settings.DEFAULT_CURRENCY)
    )
    price = MoneyField(
        required=False,
        max_digits=14,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        min_value=Money(0, currency=settings.DEFAULT_CURRENCY)
    )
    used_coupon = PrimaryKeyField(
        serializer=CouponSerializer,
        queryset=Coupon.objects.all(),
        model=Coupon,
        required=False,
        allow_null=True,
    )

    employee_payments = EmployeeRecordPaymentSerializer(
        many=True, 
        read_only=True
    )

    class Meta:
        model = Record
        fields = (
            'id',
            'status',
            'status_display',
            'status_changed',
            'created_at',
            'created_by',
            'parlor',
            'customer',
            'performer',
            'type',
            'datetime',
            'approximate_time',
            'comment',
            'sketch',
            'prepayments',
            'prepayment',
            'reason',
            'rollback_prepayment',
            'price',
            'used_coupon',
            'employee_payments',
        )
        extra_kwargs = {
            'status': {'required': False},
            'status_changed': {'read_only': True},
            'created_at': {'read_only': True},
            'rollback_prepayment': {'required': False},
            'reason': {'required': False},
        }

    def validate(self, attrs):

        if self.context['request'].method == "PATCH":
            if (status := attrs.get('status', None)) is not None:
                if status == Record.STATUS.canceled:
                    if attrs.get('reason', None) is None:
                        # Показать ошибку, если не указана причина отмены записи.
                        raise serializers.ValidationError({'reason': settings.STRINGS['REQUIRED']})
                    if attrs.get('rollback_prepayment', None) is None:
                        # Показать ошибку, если не указан тип возврата предоплаты.
                        raise serializers.ValidationError({'rollback_prepayment': settings.STRINGS['REQUIRED']})
                elif status == Record.STATUS.in_work:
                    # Показать ошибку, если нет мастера и пытаемся начать сеанс.
                    if not self.instance.performer:
                        raise serializers.ValidationError("Перед началом сеанса выберите исполнителя!")
                elif status == Record.STATUS.finished:

                    if attrs.get('price', None) is None:
                        raise serializers.ValidationError({'price': settings.STRINGS['REQUIRED']})

            elif self.instance.status not in Record.EDIT_STATUSES:
                # Если статус записи не "Новый" и не "Ожидается" - запретить изменение данных.
                raise serializers.ValidationError(f"Нельзя изменить запись в статусе: {self.instance.get_status_display()}")

            if (_type := attrs.get('type', None)) is not None:
                if self.instance.performer:
                    if not self.instance.performer.session_motivations.filter(session_type=_type).exists():
                        # Обнулить исполнителя, если у текущего нет мотивации за сеанс.
                        attrs['performer'] = None
        return attrs

    def update(self, instance, validated_data):

        if validated_data.get('status') == Record.STATUS.in_work:
            return instance.start_record()
        elif validated_data.get('status') == Record.STATUS.canceled:
            return instance.cancel_record(
                reason=validated_data.get('reason'),
                rollback_prepayment=validated_data.get('rollback_prepayment')
            )
        elif validated_data.get('status') == Record.STATUS.finished:
            return instance.finish_record(
                price=validated_data.get('price'),
                finished_by=self.context['request'].user,
                used_coupon=validated_data.get('used_coupon', None)
            )

        return super(RecordSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        return Record.create_record(**validated_data)
