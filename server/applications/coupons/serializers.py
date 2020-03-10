from rest_framework import serializers

from applications.coupons.models import Coupon
from applications.accounts.serializers import UsernameSerializer
from applications.parlors.serializers import ParlorSerializer


class CouponSerializer(serializers.ModelSerializer):

    type_display = serializers.CharField(source="get_type_display", read_only=True)
    created_by = UsernameSerializer(read_only=True)
    parlor = ParlorSerializer(read_only=True)

    class Meta:
        model = Coupon
        fields = (
            'id',
            'type',
            'type_display',
            'code',
            'created_at',
            'created_by',
            'parlor',
            'denomination',
            'comment',
        )
        read_only_fields = ('id', 'created_at', 'code')
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super(CouponSerializer, self).create(validated_data)
