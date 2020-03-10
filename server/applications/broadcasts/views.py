from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response

from applications.broadcasts.models import Phone
from applications.broadcasts.serializers import PhoneSerializer


class PhoneViewSet(viewsets.ModelViewSet):
    serializer_class = PhoneSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Phone.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('number',)


class PhoneVerifyAPIView(generics.CreateAPIView):
    serializer_class = PhoneSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return get_object_or_404(Phone, pk=self.kwargs.pop('pk', None))

    def post(self, request, *args, **kwargs):
        obj = self.get_object()
        print(obj.render_verification_sms_template())
        return Response({"status": "sent"}, status=status.HTTP_201_CREATED)
