from applications.motivations.models import (
    DefaultSessionMotivation,
    DefaultEducationMotivation,
    DefaultStoreMotivation,
    SessionMotivation,
    EducationMotivation,
    StoreMotivation,
)


def profile_post_save(sender, instance, created, **kwargs):

    if created:

        session_motivations = DefaultSessionMotivation.objects.filter(role=instance.role)
        education_motivations = DefaultEducationMotivation.objects.filter(role=instance.role)
        sell_motivations = DefaultStoreMotivation.objects.filter(role=instance.role)

        SessionMotivation.objects.bulk_create([
            SessionMotivation(
                session_type=motivation.session_type,
                employee=instance,
                base_percent=motivation.base_percent,
                invite_percent=motivation.invite_percent,
            )
            for motivation in session_motivations
        ])

        EducationMotivation.objects.bulk_create([
            EducationMotivation(
                session_type=motivation.session_type,
                employee=instance,
                base_percent=motivation.base_percent,
                invite_percent=motivation.invite_percent,
            )
            for motivation in education_motivations
        ])

        StoreMotivation.objects.bulk_create([
            StoreMotivation(
                sell_category=motivation.sell_category,
                employee=instance,
                base_percent=motivation.base_percent,
            )
            for motivation in sell_motivations
        ])


def payment_post_save(sender, instance, created, **kwargs):

    if not created and (transaction := instance.transaction):
        transaction.amount = instance.INDICATOR * instance.amount
        transaction.save(update_fields=['amount'])

