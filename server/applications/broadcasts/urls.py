from django.urls import path, re_path
from rest_framework import routers

from applications.broadcasts.views import PhoneViewSet, PhoneVerifyAPIView

router = routers.SimpleRouter()

router.register('phone', PhoneViewSet, basename="phone")

urlpatterns = router.urls + [
    re_path(r"^phone/(?P<pk>[^/.]+)/verify/", PhoneVerifyAPIView.as_view(), name="phone-verify")
]
