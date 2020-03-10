from applications.warehouse.models import Item, Warehouse


def parlor_post_create(sender, instance, created, *args, **kwargs):
    if created:
        Warehouse.objects.bulk_create([
            Warehouse(parlor=instance, item_id=item_id)
            for item_id in Item.objects.values_list('id', flat=True)
        ])
