from django.conf import settings
from django.urls import path, include
from django.contrib import admin
from django.contrib.staticfiles.urls import static
from rest_framework_jwt.views import obtain_jwt_token

from applications.accounts.views import CurrentUserView, UserPasswordUpdateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('jet/', include('jet.urls', 'jet')),
]

if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += [path('rosetta/', include('rosetta.urls'))]

if 'des' in settings.INSTALLED_APPS:
    urlpatterns += [path('django-des/', include('des.urls'))]

if 'smart_selects' in settings.INSTALLED_APPS:
    urlpatterns += [path('chaining/', include('smart_selects.urls'))]

if settings.DEBUG:
    urlpatterns += (
            static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) +
            static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    )

    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [
            path('__debug__/', include(debug_toolbar.urls)),
        ]

API_VERSION = getattr(settings, 'API_VERSION', 1)
API_BASE_PREFIX = f'api/v{API_VERSION}/'

urlpatterns += [
    path(API_BASE_PREFIX, include([
        path('auth/', include([
            path('login/', obtain_jwt_token),
            path('current/', CurrentUserView.as_view()),
            path('change-password/', UserPasswordUpdateView.as_view())
        ])),
        path('', include('applications.accounts.urls')),
        path('', include('applications.broadcasts.urls')),
        path('types/', include('applications.core.urls')),
        path('', include('applications.coupons.urls')),
        path('', include('applications.customers.urls')),
        path('', include('applications.expenses.urls')),
        path('', include('applications.parlors.urls')),
        path('', include('applications.records.urls')),
        path('', include('applications.motivations.urls')),
        path('', include('applications.notifications.urls')),
        path('', include('applications.warehouse.urls')),
    ])),
]
