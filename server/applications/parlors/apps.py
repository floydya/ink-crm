from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _


class ParlorConfig(AppConfig):
    name = "applications.parlors"
    verbose_name = _("Parlors")

    def ready(self):
        from applications.parlors.signals import parlor_post_create
        post_save.connect(parlor_post_create, sender=self.get_model('Parlor'))
