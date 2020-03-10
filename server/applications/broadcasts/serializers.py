from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from applications.broadcasts.models import Phone


# Todo: post save phone -> send sms with verification code
class PhoneSerializer(serializers.ModelSerializer):
    number = PhoneNumberField(required=True)
    verification_code = serializers.CharField(required=False)

    class Meta:
        model = Phone
        fields = (
            'id',
            'customer',
            'number',
            'verification_code',
            'generated_at',
            'confirmed',
        )
        read_only_fields = ('id', 'customer', 'generated_at', 'confirmed')

    def validate(self, attrs):
        if (verification_code := attrs.pop('verification_code', None)) is not None:
            if verification_code != self.instance.verification_code:
                raise serializers.ValidationError(
                    {"verification_code": "Пин-код введен неверно"}
                )
            else:
                attrs['confirmed'] = True
        return attrs
