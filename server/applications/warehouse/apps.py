from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _


class WarehouseConfig(AppConfig):
    name = "applications.warehouse"
    verbose_name = _("Warehouse")

    def ready(self):
        from applications.warehouse.signals import item_post_create
        post_save.connect(item_post_create, sender=self.get_model('Item'))
