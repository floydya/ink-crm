from applications.parlors.models import Parlor
from applications.warehouse.models import Warehouse


def item_post_create(sender, instance, created, *args, **kwargs):
    if created:
        Warehouse.objects.bulk_create([
            Warehouse(parlor_id=parlor_id, item=instance)
            for parlor_id in Parlor.objects.values_list('id', flat=True)
        ])
