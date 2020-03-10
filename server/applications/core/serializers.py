from rest_framework import serializers

from applications.core.models import (
    SessionType, 
    FineType, 
    FindOutType, 
    BountyType,
    ExpenseType
)


class SessionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SessionType
        fields = '__all__'


class FineTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = FineType
        fields = '__all__'


class BountyTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = BountyType
        fields = '__all__'


class FindOutTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = FindOutType
        fields = '__all__'


class ExpenseTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseType
        fields = '__all__'
