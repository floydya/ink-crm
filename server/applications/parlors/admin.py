from django.contrib import admin
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from applications.parlors.models import Parlor, Transaction
from shared.admin import RedirectMixin
from shared.models import TransactionAdmin


@admin.register(Parlor)
class ParlorAdmin(admin.ModelAdmin, RedirectMixin):
    search_fields = ('name',)
    readonly_fields = ('get_transactions_redirect', 'get_warehouse_redirect')

    def get_transactions_redirect(self, instance):
        url = reverse('admin:parlors_transaction_changelist') + f"?purpose__id__exact={instance.id}"
        return self.redirect_url(url)
    get_transactions_redirect.short_description = _("Transactions")

    def get_warehouse_redirect(self, instance):
        url = reverse('admin:warehouse_warehouse_changelist') + f"?parlor__id__exact={instance.id}"
        return self.redirect_url(url)
    get_warehouse_redirect.short_description = _("Warehouse")


admin.site.register(Transaction, TransactionAdmin)
