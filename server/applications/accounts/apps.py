from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _


class AccountConfig(AppConfig):
    name = 'applications.accounts'
    verbose_name = _("Employees")

    def ready(self):
        from applications.accounts.signals import profile_post_save, payment_post_save
        post_save.connect(profile_post_save, self.get_model('Profile'))
        post_save.connect(payment_post_save, self.get_model('Bounty'))
        post_save.connect(payment_post_save, self.get_model('Fine'))
