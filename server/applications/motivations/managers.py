from django.db import models
from django.db.models.signals import post_save


class MotivationManager(models.Manager):

    def bulk_create(self, objs, **kwargs):
        returned = super(MotivationManager, self).bulk_create(objs, **kwargs)
        for obj in objs:
            post_save.send(sender=obj.__class__, instance=obj, created=True, using=None)
        return returned
