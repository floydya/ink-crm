from rest_framework import serializers

from applications.core.models import SessionType
from applications.core.serializers import SessionTypeSerializer
from applications.motivations.models import (
    SessionMotivation,
    StoreMotivation,
    EducationMotivation
)
from applications.warehouse.models import Category
from applications.warehouse.serializers import CategorySerializer
from shared.serializers import PrimaryKeyField

__all__ = (
    'SessionMotivationSerializer',
    'EducationMotivationSerializer',
    'StoreMotivationSerializer',
)


class MotivationUpdatedByMixin:

    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class SessionMotivationSerializer(MotivationUpdatedByMixin, serializers.ModelSerializer):

    session_type = PrimaryKeyField(
        serializer=SessionTypeSerializer,
        model=SessionType,
        queryset=SessionType.objects.all()
    )

    class Meta:
        model = SessionMotivation
        fields = (
            'id',
            'employee',
            'session_type',
            'base_percent',
            'invite_percent',
        )


class EducationMotivationSerializer(MotivationUpdatedByMixin, serializers.ModelSerializer):

    session_type = PrimaryKeyField(
        serializer=SessionTypeSerializer,
        model=SessionType,
        queryset=SessionType.objects.all()
    )

    class Meta:
        model = EducationMotivation
        fields = (
            'id',
            'employee',
            'session_type',
            'base_percent',
            'invite_percent',
        )


class StoreMotivationSerializer(MotivationUpdatedByMixin, serializers.ModelSerializer):

    sell_category = PrimaryKeyField(
        serializer=CategorySerializer,
        model=Category,
        queryset=Category.objects.all()
    )

    class Meta:
        model = StoreMotivation
        fields = (
            'id',
            'employee',
            'sell_category',
            'base_percent',
        )
