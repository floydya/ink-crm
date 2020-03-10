from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _


class CouponsConfig(AppConfig):
    name = 'applications.coupons'
    verbose_name = _("coupons")

    def ready(self):
        from applications.coupons.signals import coupon_post_save
        post_save.connect(coupon_post_save, self.get_model('Coupon'))
