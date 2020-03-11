from django.contrib.contenttypes.models import ContentType
from django.db import models, transaction

from applications.parlors.models import Transaction

__all__ = 'ExpenseManager',


class ExpenseManager(models.Manager):

    def get_queryset(self):
        ctype = ContentType.objects.get_for_model(self.model)
        transaction_subquery = Transaction.objects.filter(
            entity_type__pk=ctype.id,
            entity_id=models.OuterRef('pk'),
        ).values('entity_id').annotate(total=models.Sum('amount')).values('total')
        return super(ExpenseManager, self).get_queryset().annotate(
            payed_amount=models.Func(models.Subquery(transaction_subquery), function='ABS')
        )

    @transaction.atomic
    def create(self, **kwargs):
        payed_amount = kwargs.pop('payed_amount', None)
        instance = super(ExpenseManager, self).create(**kwargs)
        if payed_amount is not None:
            Transaction.create_transaction(
                transaction_purpose_pk=instance.parlor.id,
                amount=-payed_amount,
                created_by=instance.created_by,
                reference=f"Оплата расхода №{instance.id}",
                entity_object=instance
            )
        return instance
