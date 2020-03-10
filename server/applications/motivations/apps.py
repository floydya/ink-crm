from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _


class MotivationConfig(AppConfig):
    name = "applications.motivations"
    verbose_name = _("Motivations")

    def ready(self):
        from applications.motivations.signals import (
            motivation_post_save,
            motivation_propagate
        )

        post_save.connect(motivation_post_save, sender=self.get_model("SessionMotivation"))
        post_save.connect(motivation_post_save, sender=self.get_model("StoreMotivation"))
        post_save.connect(motivation_post_save, sender=self.get_model("EducationMotivation"))

        post_save.connect(motivation_propagate, sender=self.get_model("DefaultSessionMotivation"))
        post_save.connect(motivation_propagate, sender=self.get_model("DefaultEducationMotivation"))
        post_save.connect(motivation_propagate, sender=self.get_model("DefaultStoreMotivation"))
