import datetime
import os

import environ
import jinja2
from pathlib import Path

from django_jinja.builtins import DEFAULT_EXTENSIONS
from django.utils.translation import ugettext_lazy as _

BASE_DIR = Path(__file__)
BASE_ROOT = BASE_DIR.parent.parent

env = environ.Env(DEBUG=(bool, False), )

env_file = str(BASE_ROOT.parent / '.env')
env.read_env(env_file)

PARLOR_MODEL = 'parlors.Parlor'

SECRET_KEY = env('DJANGO_SECRET_KEY')
DEBUG = env('DJANGO_DEBUG') == "True"
ALLOWED_HOSTS = list()

SHARED_APPS = (
    'cacheops',
    'phonenumber_field',
    'rosetta',
    'django_jinja',
    'solo',
    'django_filters',
    'rest_framework',
    'django_cleanup.apps.CleanupConfig',
    'corsheaders',
    'djmoney',
    'rest_framework_swagger',
    'mptt',
    'jet',
    'django_celery_beat',

    'postie',
    'codemirror2',
    'ckeditor',
    'des',
)

TENANT_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'debug_toolbar',

    'applications.accounts',
    'applications.broadcasts',
    'applications.core',
    'applications.coupons',
    'applications.customers',
    'applications.expenses',
    'applications.motivations',
    'applications.notifications',
    'applications.parlors',
    'applications.records',
    'applications.warehouse',
)

INSTALLED_APPS = list(SHARED_APPS) + [app for app in TENANT_APPS if app not in SHARED_APPS]

JQUERY_URL = False

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

INTERNAL_IPS = ('127.0.0.1',)

CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django_jinja.backend.Jinja2',
        'NAME': 'jinja2',
        'APP_DIRS': True,
        'DIRS': [],
        'OPTIONS': {
            'environment': 'shared.env.jinja2.environment',
            'match_extension': '.jinja',
            'newstyle_gettext': True,
            'auto_reload': True,
            'undefined': jinja2.Undefined,
            'debug': True,
            'filters': {},
            'globals': {},
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
            'extensions': DEFAULT_EXTENSIONS,
            "bytecode_cache": {
                "name": "default",
                "backend": "django_jinja.cache.BytecodeCache",
                "enabled": True,
            },
        },
    },
    {
        'DIRS': [os.path.join(BASE_ROOT.parent, 'markup', 'templates')],
        'APP_DIRS': True,
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
                'django.contrib.auth.context_processors.auth',
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'

DATABASES = {
    'default': env.db('DJANGO_DB_URL')
}
# DATABASES['default']['CONN_MAX_AGE'] = env.int('CONN_MAX_AGE', default=0)
DATABASES['default']['CONN_MAX_AGE'] = None
DATABASES['default']['DISABLE_SERVER_SIDE_CURSORS'] = True

AUTH_USER_MODEL = 'accounts.User'
PROFILE_USER_MODEL = 'accounts.Profile'

EMAIL_BACKEND = 'des.backends.ConfiguredEmailBackend'
POSTIE_HTML_ADMIN_WIDGET = {
    "widget": "CKEditorWidget",
    "widget_module": "ckeditor.widgets",
    "attrs": {"attrs": {"cols": 80, "rows": 10}}
}
CKEDITOR_CONFIGS = {
    'default': {
        'skin': 'moono',
        # 'skin': 'office2013',
        'toolbar_Basic': [
            ['Source', '-', 'Bold', 'Italic']
        ],
        'toolbar_YourCustomToolbarConfig': [
            {'name': 'document', 'items': ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
            {'name': 'clipboard', 'items': ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {'name': 'editing', 'items': ['Find', 'Replace', '-', 'SelectAll']},
            {'name': 'forms',
             'items': ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                       'HiddenField']},
            '/',
            {'name': 'basicstyles',
             'items': ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']},
            {'name': 'paragraph',
             'items': ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
                       'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl',
                       'Language']},
            {'name': 'links', 'items': ['Link', 'Unlink', 'Anchor']},
            {'name': 'insert',
             'items': ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']},
            '/',
            {'name': 'styles', 'items': ['Styles', 'Format', 'Font', 'FontSize']},
            {'name': 'colors', 'items': ['TextColor', 'BGColor']},
            {'name': 'tools', 'items': ['Maximize', 'ShowBlocks']},
            {'name': 'about', 'items': ['About']},
            '/',  # put this to force next toolbar on new line
            {'name': 'yourcustomtools', 'items': [
                # put the name of your editor.ui.addButton here
                'Preview',
                'Maximize',

            ]},
        ],
        'toolbar': 'YourCustomToolbarConfig',  # put selected toolbar config here
        # 'toolbarGroups': [{ 'name': 'document', 'groups': [ 'mode', 'document', 'doctools' ] }],
        # 'height': 291,
        # 'width': '100%',
        # 'filebrowserWindowHeight': 725,
        # 'filebrowserWindowWidth': 940,
        # 'toolbarCanCollapse': True,
        # 'mathJaxLib': '//cdn.mathjax.org/mathjax/2.2-latest/MathJax.js?config=TeX-AMS_HTML',
        'tabSpaces': 4,
        'extraPlugins': ','.join([
            'uploadimage',  # the upload image feature
            # your extra plugins here
            'div',
            'autolink',
            'autoembed',
            'embedsemantic',
            'autogrow',
            # 'devtools',
            'widget',
            'lineutils',
            'clipboard',
            'dialog',
            'dialogui',
            'elementspath'
        ]),
    }
}
POSTIE_INSTANT_SEND = True

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'ru'
LANGUAGES = (
    ('ru', _('Russian')),
)
LOCALE_PATHS = (
    BASE_ROOT / 'locale',
)

TIME_ZONE = 'Europe/Kiev'
USE_I18N = True
USE_L10N = True
USE_TZ = True
USE_DJANGO_JQUERY = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_ROOT / 'static'

MEDIA_URL = '/uploads/'
MEDIA_ROOT = BASE_ROOT / 'uploads'

SITE_ID = 1
CACHES = {
    'default': env.cache_url('DJANGO_CACHE_URL', 'dummycache://127.0.0.1')
}
SOLO_CACHE = "default"

CACHEOPS_REDIS = "redis://cache:6379/1"
CACHEOPS = {
    # Automatically cache any User.objects.get() calls for 15 minutes
    # This also includes .first() and .last() calls,
    # as well as request.user or post.author access,
    # where Post.author is a foreign key to auth.User
    'accounts.*': {'ops': {'get', 'fetch', 'count'}, 'timeout': 60 * 15},

    # Automatically cache all gets and queryset fetches
    # to other django.contrib.auth models for an hour
    'core.*': {'ops': {'fetch', 'get', 'count'}, 'timeout': 60 * 15},
    'parlors.Parlor': {'ops': {'fetch', 'get', 'count'}, 'timeout': 60 * 15},
    # 'core.*': {'ops': {'fetch', 'get'}, 'timeout': 60*60},

    # Cache all queries to Permission
    # 'all' is an alias for {'get', 'fetch', 'count', 'aggregate', 'exists'}

    'parlors.Transaction': {'ops': 'all', 'timeout': 60 * 60},

    # Enable manual caching on all other models with default timeout of an hour
    # Use Post.objects.cache().get(...)
    #  or Tags.objects.filter(...).order_by(...).cache()
    # to cache particular ORM request.
    # Invalidation is still automatic
    '*.*': {'ops': (), 'timeout': 60 * 60},

    # And since ops is empty by default you can rewrite last line as:
    # '*.*': {'timeout': 60*60},

    # NOTE: binding signals has its overhead, like preventing fast mass deletes,
    #       you might want to only register whatever you cache and dependencies.

    # Finally you can explicitely forbid even manual caching with:
    # 'some_app.*': None,
}

CELERY_BROKER_URL = env.str('CELERY_BROKER_URL')
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'
}

JWT_AUTH = {
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=36000),
    'JWT_ALLOW_REFRESH': True,
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    # 'JWT_RESPONSE_PAYLOAD_HANDLER': 'shared.jwt_handler.jwt_response_payload_handler',
}

DATA_UPLOAD_MAX_NUMBER_FIELDS = 10240

FILTERS_NULL_CHOICE_LABEL = True
DEFAULT_CURRENCY = "UAH"
CURRENCIES = ('UAH',)
CURRENCY_CHOICES = [('UAH', 'UAH ₴')]

# DEBUG_TOOLBAR_CONFIG = {
#     'SHOW_TOOLBAR_CALLBACK': lambda x: True,
# }
JET_CHANGE_FORM_SIBLING_LINKS = False

STRINGS = {
    'REQUIRED': _("This field is required."),
}
