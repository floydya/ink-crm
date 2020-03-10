from rest_framework import viewsets, permissions

from applications.motivations.models import SessionMotivation, EducationMotivation, StoreMotivation
from applications.motivations.serializers import (
    SessionMotivationSerializer,
    EducationMotivationSerializer,
    StoreMotivationSerializer,
)


class SessionMotivationViewSet(viewsets.ModelViewSet):
    serializer_class = SessionMotivationSerializer
    queryset = SessionMotivation.objects.all()
    permission_classes = (permissions.IsAuthenticated,)


class EducationMotivationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationMotivationSerializer
    queryset = EducationMotivation.objects.all()
    permission_classes = (permissions.IsAuthenticated,)


class StoreMotivationViewSet(viewsets.ModelViewSet):
    serializer_class = StoreMotivationSerializer
    queryset = StoreMotivation.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
