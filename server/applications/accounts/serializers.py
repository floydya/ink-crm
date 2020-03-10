from django.db.models import Q
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from drf_base64.fields import Base64ImageField
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from applications.accounts.base_serializers import UsernameSerializer
from applications.accounts.models import User, Profile, Fine, Bounty, Weekend
from applications.core.models import FineType, BountyType
from applications.core.serializers import FineTypeSerializer, BountyTypeSerializer
from applications.motivations.models import Transaction
from applications.motivations.serializers import (
    SessionMotivationSerializer, EducationMotivationSerializer,
    StoreMotivationSerializer,
)
from applications.parlors.models import Parlor
from applications.parlors.serializers import ParlorSerializer
from shared.serializers import PrimaryKeyField


class ProfileUsernameSerializer(serializers.ModelSerializer):
    user = UsernameSerializer()
    parlor = ParlorSerializer()
    role = serializers.CharField(source='get_role_display')

    class Meta:
        model = Profile
        fields = ('id', 'parlor', 'user', 'role')
        read_only_fields = fields


class ProfileIsActiveListSerializer(serializers.ListSerializer):

    def to_representation(self, data):
        data = data.filter(is_active=True)
        return super(ProfileIsActiveListSerializer, self).to_representation(data)


class ProfileSerializer(serializers.ModelSerializer):
    session_motivations = SessionMotivationSerializer(many=True, read_only=True)
    education_motivations = EducationMotivationSerializer(many=True, read_only=True)
    sell_motivations = StoreMotivationSerializer(many=True, read_only=True)
    parlor = PrimaryKeyField(
        serializer=ParlorSerializer,
        model=Parlor,
        queryset=Parlor.objects.all()
    )
    user = PrimaryKeyField(
        serializer=UsernameSerializer,
        model=User,
        queryset=User.objects.all()
    )
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    balance = serializers.DecimalField(source='get_balance', max_digits=14, decimal_places=2, read_only=True)
    # weekends = WeekendSerializer(many=True)

    class Meta:
        model = Profile
        list_serializer_class = ProfileIsActiveListSerializer
        fields = (
            'id',
            'user',
            'balance',
            'parlor',
            'role',
            'role_display',
            'is_active',
            'session_motivations',
            'education_motivations',
            'sell_motivations',
        )


class UserSerializer(serializers.ModelSerializer):
    avatar = Base64ImageField(
        required=False,
        allow_null=True
    )
    phone_number = PhoneNumberField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    profile = ProfileSerializer(many=True, read_only=True)
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'middle_name',
            'last_name',
            'full_name',
            'is_active',
            'is_staff',
            'is_superuser',
            'banned',
            'phone_number',
            'birth_date',
            'avatar',
            'profile',
            'date_joined',
            'last_login',
            'new_password',
            'confirm_new_password',
        )
        read_only_fields = (
            'id',
            'is_active',
            'is_staff',
            'is_superuser',
            'banned',
            'profile',
            'date_joined',
            'last_login',
        )

    def validate(self, attrs):
        new_password = attrs.get('new_password', None)
        confirm_new_password = attrs.get('confirm_new_password', None)

        if new_password and confirm_new_password and new_password != confirm_new_password:
            raise serializers.ValidationError({
                "new_password": "Введенные пароли не совпадают!",
                "confirm_new_password": "Введенные пароли не совпадают!",
            })
        return attrs

    def create(self, validated_data):
        password, _p = validated_data.pop('new_password'), validated_data.pop('confirm_new_password')
        validated_data['password'] = password
        return User.objects.create_user(**validated_data)


class AbstractPaymentEntitySerializer(serializers.ModelSerializer):
    created_by = UsernameSerializer(read_only=True)
    status_changed_by = UsernameSerializer(read_only=True)
    employee = PrimaryKeyField(
        serializer=ProfileUsernameSerializer,
        model=Profile,
        queryset=Profile.objects.all()
    )

    class Meta:
        fields = (
            'id', 'created_by', 'created_at', 'month', 'year',
            'type', 'employee', 'amount', 'note', 'status', 'href',
            'status_changed_by', 'status_changed_at', 'status_change_reason',
        )
        read_only_fields = ('created_at', 'status_changed_at')
        extra_kwargs = {
            'status': {'allow_null': True},
            'status_change_reason': {'required': False},
            'month': {'required': False},
            'year': {'required': False},
        }

    def validate(self, attrs):

        if self.context['request'].method == "PATCH":
            if attrs.get('status') is False:
                if not attrs.get('status_change_reason'):
                    raise serializers.ValidationError({
                        'status_change_reason': _("Укажите причину отмены.")
                    })
        return attrs

    def update(self, instance, validated_data):
        if (status := validated_data.get('status', "null")) != "null":
            timestamp = timezone.now()
            user = self.context['request'].user
            return self.Meta.model.proceed_status(
                entity_pk=instance.id,
                status=status,
                user=user,
                timestamp=timestamp,
                status_change_reason=validated_data.get('status_change_reason', None),
            )
        return super(AbstractPaymentEntitySerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super(AbstractPaymentEntitySerializer, self).create(validated_data)


class FineSerializer(AbstractPaymentEntitySerializer):
    type = PrimaryKeyField(
        serializer=FineTypeSerializer,
        model=FineType,
        queryset=FineType.objects.all()
    )

    class Meta(AbstractPaymentEntitySerializer.Meta):
        model = Fine


class BountySerializer(AbstractPaymentEntitySerializer):
    type = PrimaryKeyField(
        serializer=BountyTypeSerializer,
        model=BountyType,
        queryset=BountyType.objects.all()
    )

    class Meta(AbstractPaymentEntitySerializer.Meta):
        model = Bounty


class WeekendSerializer(serializers.ModelSerializer):
    employee = PrimaryKeyField(
        serializer=ProfileUsernameSerializer,
        model=Profile,
        queryset=Profile.objects.all()
    )

    class Meta:
        model = Weekend
        fields = (
            'id', 'employee', 'date', 'from_time', 'to_time',
            'created_at', 'created_by',
        )
        read_only_fields = ('created_at', 'created_by')

    def validate(self, attrs):
        date = attrs.get('date')
        _from, _to = attrs.get('from_time'), attrs.get('to_time')
        combined_from = timezone.datetime.combine(date, _from)
        combined_to = timezone.datetime.combine(date, _to)

        if combined_from > combined_to:
            raise serializers.ValidationError({
                "from_time": """Время "от" должно быть меньше "до".""",
                "to_time": """Время "до" должно быть больше "от".""",
            })

        # Todo: don't include _to in from!range and _from in to!range
        if self.Meta.model.objects.filter(date=date).filter(
                Q(from_time__range=[_from, _to]) | Q(to_time__range=[_from, _to])
        ).exists():
            raise serializers.ValidationError("Время не должно пересекаться!")

        return attrs

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super(WeekendSerializer, self).create(validated_data)


class UserPasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    repeat_new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        repeat_new_password = attrs.get('repeat_new_password')

        if new_password != repeat_new_password:
            raise serializers.ValidationError({
                'new_password': "Пароли должны совпадать!",
                'repeat_new_password': "Пароли должны совпадать!",
            })

        if old_password == new_password:
            raise serializers.ValidationError("Новый и старый пароли не отличаются!")

        if not self.instance.check_password(old_password):
            raise serializers.ValidationError({
                'old_password': "Текущий пароль введен неверно!",
            })

        return attrs

    def update(self, instance: User, validated_data):
        instance.set_password(validated_data.get('new_password'))
        instance.save()
        return instance

    def create(self, validated_data):
        pass


class TransactionEntityRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, Bounty):
            return BountySerializer(value).data
        elif isinstance(value, Fine):
            return FineSerializer(value).data
        else:
            
            class AbstractSerializer(serializers.ModelSerializer):

                class Meta:
                    model = value.__class__
                    fields = '__all__'
                
            return AbstractSerializer(value).data

        raise Exception(f"Unexpected transaction entity type {type(value)}")


class TransactionSerializer(serializers.ModelSerializer):

    created_by = UsernameSerializer()
    transaction_type = serializers.CharField(source='get_transaction_type_display')
    entity_type = serializers.CharField(source='entity_type.name')
    entity__type = serializers.CharField(source='entity_type.model')
    entity_object = TransactionEntityRelatedField(read_only=True)

    class Meta:
        model = Transaction
        fields = (
            'id',
            'created_by',
            'created_at',
            'transaction_code',
            'transaction_type',
            'amount',
            'entity_type',
            'entity__type',
            'entity_id',
            'reference',
            'entity_object'
        )
        read_only_fields = fields
