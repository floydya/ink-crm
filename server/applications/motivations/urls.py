from django.urls import path, include

from rest_framework import routers

from applications.motivations.views import SessionMotivationViewSet, EducationMotivationViewSet, StoreMotivationViewSet

router = routers.SimpleRouter()

router.register('sessions', SessionMotivationViewSet, basename='session-motivation')
router.register('educations', EducationMotivationViewSet, basename='session-motivation')
router.register('sells', StoreMotivationViewSet, basename='session-motivation')

urlpatterns = [
    path('motivation/', include(router.urls)),
]
