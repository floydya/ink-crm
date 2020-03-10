from django.conf import settings
from django.db import DEFAULT_DB_ALIAS
from django.db.transaction import Atomic, get_connection


class LockedAtomicTransaction(Atomic):
    """
    modified from https://stackoverflow.com/a/41831049
    this is needed for safely merging
    Does a atomic transaction, but also locks the entire table for any transactions, for the duration of this
    transaction. Although this is the only way to avoid concurrency issues in certain situations, it should be used with
    caution, since it has impacts on performance, for obvious reasons...
    """

    def __init__(self, *models, using=None, savepoint=None):
        if using is None:
            using = DEFAULT_DB_ALIAS
        super().__init__(using, savepoint)
        self.models = models

    def __enter__(self):
        super(LockedAtomicTransaction, self).__enter__()

        # Make sure not to lock, when sqlite is used, or you'll run into problems while running tests!!!
        if settings.DATABASES[self.using]["ENGINE"] != "django.db.backends.sqlite3":
            cursor = None
            try:
                cursor = get_connection(self.using).cursor()
                for model in self.models:
                    cursor.execute(
                        "LOCK TABLE {table_name}".format(table_name=model._meta.db_table)
                    )
            finally:
                if cursor and not cursor.closed:
                    cursor.close()
