from django.contrib import admin
from django.contrib.auth.admin import (
    UserAdmin as NativeUserAdmin,
    Group as NativeGroup
)
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from jet.filters import DateRangeFilter, RelatedFieldAjaxListFilter

from applications.accounts.models import User, Weekend, Fine, Bounty, Profile, Group
from applications.motivations.admin import SessionMotivationInline, StoreMotivationInline, EducationMotivationInline
from shared.admin import RedirectMixin, CompactInline

admin.site.unregister(NativeGroup)
admin.site.register(Group)


class AbstractPaymentAdmin(admin.ModelAdmin):
    list_filter = (
        ('employee', RelatedFieldAjaxListFilter),
        'status',
        ('created_at', DateRangeFilter),
    )
    list_display = ('id', 'employee', 'status', 'created_at')
    readonly_fields = ('created_by', 'created_at', 'status', 'status_changed_by', 'status_changed_at')

    def get_model_perms(self, request):
        return {}

    def save_model(self, request, obj, form, change):
        if not obj.id:
            obj.created_by = request.user
        else:
            obj.status_changed_by = request.user
        return super(AbstractPaymentAdmin, self).save_model(request, obj, form, change)


admin.site.register(Fine, AbstractPaymentAdmin)
admin.site.register(Bounty, AbstractPaymentAdmin)


@admin.register(Weekend)
class WeekendAdmin(admin.ModelAdmin):
    list_filter = (
        ('employee', RelatedFieldAjaxListFilter),
        ('date', DateRangeFilter)
    )
    list_display = ('id', 'employee', 'date', 'from_time', 'to_time')
    readonly_fields = ('created_by', 'created_at')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super(WeekendAdmin, self).save_model(request, obj, form, change)

    def get_model_perms(self, request):
        return {}


class ProfileInline(CompactInline, RedirectMixin):
    model = Profile
    show_change_link = True
    fk_name = 'user'
    readonly_fields = (
        'get_profile_redirect',
        'get_fines_redirect',
        'get_bounties_redirect',
        'get_weekends_redirect',
        'get_transaction_redirect'
    )
    extra = 0

    def get_profile_redirect(self, instance):
        url = reverse('admin:accounts_profile_change', args=(instance.id,))
        return self.redirect_url(url)
    get_profile_redirect.short_description = _("Motivation control")

    def get_transaction_redirect(self, instance):
        url = reverse('admin:motivations_transaction_changelist') + f'?purpose__id__exact={instance.id}'
        return self.redirect_url(url)
    get_transaction_redirect.short_description = _("Transactions")

    def get_fines_redirect(self, instance):
        url = reverse('admin:accounts_fine_changelist') + f'?employee__id__exact={instance.id}'
        return self.redirect_url(url)
    get_fines_redirect.short_description = _("Fines")

    def get_bounties_redirect(self, instance):
        url = reverse('admin:accounts_bounty_changelist') + f'?employee__id__exact={instance.id}'
        return self.redirect_url(url)
    get_bounties_redirect.short_description = _("Bounties")

    def get_weekends_redirect(self, instance):
        url = reverse('admin:accounts_weekend_changelist') + f'?employee__id__exact={instance.id}'
        return self.redirect_url(url)
    get_weekends_redirect.short_description = _("Weekends")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    inlines = [SessionMotivationInline, StoreMotivationInline, EducationMotivationInline]

    def get_model_perms(self, request):
        return {}

    def save_formset(self, request, form, formset, change):
        for form in formset:
            if form.has_changed():
                form.instance.updated_by = request.user
        super(ProfileAdmin, self).save_formset(request, form, formset, change)


@admin.register(User)
class UserAdmin(NativeUserAdmin):
    list_select_related = True
    inlines = [ProfileInline]
    list_filter = ['is_active', 'banned']
    readonly_fields = ('last_login', 'date_joined')
    search_fields = ('get_full_name', )
    ordering = ['id']
    fieldsets = [
        [None, {
            'fields': [
                'username', 'password',
                'first_name', 'middle_name', 'last_name',
                'phone_number', 'birth_date', 'avatar',
            ]
        }],
        [_("Permissions"), {
            'fields': [
                'is_active',
                'banned',
                'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ]
        }],
        [_("Dates"), {
            'fields': ['last_login', 'date_joined']
        }]
    ]
    list_display = (
        'id', 'get_full_name',
        'is_active', 'banned',
    )
    list_display_links = ('id',)
    add_fieldsets = (None, {
        'classes': ('wide',),
        'fields': (
            'username', 'password1', 'password2',
            'first_name', 'middle_name', 'last_name',
            'phone_number', 'birth_date', 'avatar',
        ),
    }),
