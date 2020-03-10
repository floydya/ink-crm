

def coupon_post_save(sender, instance, created, **kwargs):

    if not created:
        instance.post_save()
