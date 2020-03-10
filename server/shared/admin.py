from django.contrib import admin
from django.contrib.admin import StackedInline
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from jet.admin import CompactInline as NativeCompactInline

from solo.models import DEFAULT_SINGLETON_INSTANCE_ID


class CompactInline(NativeCompactInline):
    # template = 'edit_inline/_compact.html'
    pass


class RedirectMixin:

    @staticmethod
    def redirect_url(url):
        return mark_safe(f"""
                <a href="{url}" target="_blank">{_("Open in new tab")}</a>
            """)


class QuerySetDelete:

    def delete_queryset(self, request, queryset):
        for instance in queryset:
            instance.delete()


class SingletonInline(StackedInline):
    extra = 0

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        if not self.model.objects.exists():
            self.model.objects.get_or_create(pk=self.singleton_instance_id)
        return super().get_queryset(request)

    @property
    def singleton_instance_id(self):
        return getattr(self.model, 'singleton_instance_id', DEFAULT_SINGLETON_INSTANCE_ID)
