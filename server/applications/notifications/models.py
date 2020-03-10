from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.indexes import BrinIndex
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from model_utils import Choices


class Notification(models.Model):
    LEVELS = Choices('success', 'info', 'warning', 'danger')
    level = models.CharField(
        _("Level"),
        choices=LEVELS,
        max_length=32,
        default=LEVELS.info,
    )

    recipient = models.ForeignKey(
        settings.PROFILE_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_("Recipient")
    )

    actor_content_type = models.ForeignKey(
        ContentType,
        db_index=False,
        null=True,
        blank=True,
        related_name='notifications_actor',
        on_delete=models.CASCADE,
    )
    actor_object_id = models.PositiveIntegerField(null=True, blank=True)
    actor = GenericForeignKey('actor_content_type', 'actor_object_id')

    verb = models.CharField(
        _("Verb"),
        max_length=255
    )

    target_content_type = models.ForeignKey(
        ContentType,
        related_name='notifications_target',
        blank=True,
        null=True,
        db_index=False,
        on_delete=models.CASCADE
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey('target_content_type', 'target_object_id')

    action_object_content_type = models.ForeignKey(
        ContentType,
        blank=True,
        null=True,
        db_index=False,
        related_name='notifications_action_object',
        on_delete=models.CASCADE,
    )
    action_object_object_id = models.PositiveIntegerField(null=True, blank=True)
    action_object = GenericForeignKey('action_object_content_type', 'action_object_object_id')

    timestamp = models.DateTimeField(
        _("Timestamp"),
        default=timezone.now,
    )

    class Meta:
        ordering = ('-id',)
        indexes = (BrinIndex(fields=['timestamp']),)

    def __str__(self):
        ctx = {
            'actor': self.actor or "Система",
            'verb': self.verb,
            'action_object': self.action_object,
            'target': self.target,
        }
        if self.target:
            if self.action_object:
                return u'%(actor)s %(verb)s %(action_object)s %(target)s' % ctx
            return u'%(actor)s %(verb)s %(target)s' % ctx
        if self.action_object:
            return u'%(actor)s %(verb)s %(action_object)s' % ctx
        return u'%(actor)s %(verb)s' % ctx

    def timesince(self, now=None):
        """
        Shortcut for the ``django.utils.timesince.timesince`` function of the
        current timestamp.
        """
        from django.utils.timesince import timesince as timesince_
        return timesince_(self.timestamp, now)

    @classmethod
    def create_notification(
            cls,
            recipient,
            verb,
            actor=None,
            target=None,
            action_object=None,
            level=None
    ):

        if level is None:
            level = cls.LEVELS.info

        return cls.objects.create(
            level=level,
            recipient=recipient,
            actor=actor,
            verb=verb,
            target=target,
            action_object=action_object
        )
