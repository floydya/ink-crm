from applications.accounts.models import Profile
from applications.motivations.models import (
    DefaultSessionMotivation, SessionMotivation, DefaultEducationMotivation,
    EducationMotivation,
    DefaultStoreMotivation,
    StoreMotivation,
)
from applications.notifications.models import Notification


def motivation_post_save(sender, instance, created, **kwargs):
    print(sender, instance, created)
    if created:
        verb = "добавил(-а) Вам мотивацию за"
    else:
        verb = "изменил(-а) Вашу мотивацию за"
    Notification.create_notification(
        recipient=instance.employee,
        verb=verb,
        actor=instance.updated_by,
        target=instance
    )


def motivation_propagate(sender, instance, created, **kwargs):
    if created:
        profiles = Profile.objects.filter(role=instance.role)
        if sender == DefaultSessionMotivation:
            profiles = profiles.exclude(session_motivations__session_type=instance.session_type)
            SessionMotivation.objects.bulk_create([
                SessionMotivation(
                    employee=profile,
                    session_type=instance.session_type,
                    base_percent=instance.base_percent,
                    invite_percent=instance.invite_percent
                )
                for profile in profiles
            ])
        elif sender == DefaultEducationMotivation:
            profiles = profiles.exclude(education_motivations__session_type=instance.session_type)
            EducationMotivation.objects.bulk_create([
                EducationMotivation(
                    employee=profile,
                    session_type=instance.session_type,
                    base_percent=instance.base_percent,
                    invite_percent=instance.invite_percent
                )
                for profile in profiles
            ])
        elif sender == DefaultStoreMotivation:
            profiles = profiles.exclude(sell_motivations__sell_category=instance.sell_category)
            StoreMotivation.objects.bulk_create([
                StoreMotivation(
                    employee=profile,
                    sell_category=instance.sell_category,
                    base_percent=instance.base_percent,
                )
                for profile in profiles
            ])
