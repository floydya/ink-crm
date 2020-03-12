from django.conf import settings
from djmoney.money import Money

from rest_framework import serializers
from djmoney.contrib.django_rest_framework.fields import MoneyField
from drf_base64.fields import Base64ImageField

from applications.accounts.base_serializers import UsernameSerializer
from applications.core.models import ExpenseType
from applications.core.serializers import ExpenseTypeSerializer
from applications.expenses.models import Expense
from applications.parlors.models import Parlor
from applications.parlors.serializers import ParlorSerializer

from shared.serializers import PrimaryKeyField


class ExpenseSerializer(serializers.ModelSerializer):

    created_by = UsernameSerializer(read_only=True)
    type = PrimaryKeyField(
        model=ExpenseType,
        queryset=ExpenseType.objects.all(),
        serializer=ExpenseTypeSerializer
    )
    parlor = PrimaryKeyField(
        model=Parlor,
        queryset=Parlor.objects.all(),
        serializer=ParlorSerializer
    )
    image = Base64ImageField(
        required=False,
        allow_null=True,
    )
    amount = MoneyField(
        max_digits=14, 
        decimal_places=2, 
        default_currency=settings.DEFAULT_CURRENCY
    )
    payed_amount = MoneyField(
        max_digits=14, 
        decimal_places=2, 
        default_currency=settings.DEFAULT_CURRENCY,
    )

    class Meta:
        model = Expense
        fields = (
            'id',
            'created_at',
            'created_by',
            'parlor',
            'type',
            'amount',
            'note',
            'image',
            'payed_amount',
        )

    def validate(self, attrs):

        if self.context['request'].method == "PATCH":
            if (payed_amount := attrs.get('payed_amount', None)) is not None:
                already_payed = Money(self.instance.payed_amount, settings.DEFAULT_CURRENCY)
                if payed_amount + already_payed > self.instance.amount:
                    raise serializers.ValidationError(
                        {'payed_amount': "Нельзя оплатить больше суммы платежа!"}
                    )

        return attrs

    def update(self, instance: Expense, validated_data):
        if (payed_amount := validated_data.get('payed_amount', None)) is not None:
            return instance.add_payment(payed_amount, self.context['request'].user)
        return super(ExpenseSerializer, self).update(instance, validated_data)
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user

        instance = super(ExpenseSerializer, self).create(validated_data)
        setattr(instance, 'payed_amount', validated_data.get('payed_amount', None))
        return instance
