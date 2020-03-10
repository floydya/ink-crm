from django.contrib import admin

from applications.motivations.models import (
    SessionMotivation,
    StoreMotivation,
    EducationMotivation,
    Transaction,
    DefaultSessionMotivation,
    DefaultEducationMotivation,
    DefaultStoreMotivation,
)
from shared.admin import CompactInline
from shared.models import TransactionAdmin


class DefaultSessionMotivationInline(CompactInline):
    model = DefaultSessionMotivation
    fk_name = 'session_type'
    extra = 0


class DefaultEducationMotivationInline(CompactInline):
    model = DefaultEducationMotivation
    fk_name = 'session_type'
    extra = 0


class DefaultStoreMotivationInline(CompactInline):
    model = DefaultStoreMotivation
    fk_name = 'sell_category'
    extra = 0


class SessionMotivationInline(CompactInline):
    model = SessionMotivation
    fk_name = 'employee'
    extra = 0
    readonly_fields = ('updated_by',)


class StoreMotivationInline(CompactInline):
    model = StoreMotivation
    fk_name = 'employee'
    extra = 0
    readonly_fields = ('updated_by',)


class EducationMotivationInline(CompactInline):
    model = EducationMotivation
    fk_name = 'employee'
    extra = 0
    readonly_fields = ('updated_by',)


admin.site.register(Transaction, TransactionAdmin)
