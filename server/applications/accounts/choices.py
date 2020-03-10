from django.utils.translation import ugettext_lazy as _

from model_utils import Choices


ROLE_CHOICES = Choices(
    ('owner', _("Owner")),
    ('director', _("Director")),
    ('administrator', _("Administrator")),
    ('master', _("Master")),
)
