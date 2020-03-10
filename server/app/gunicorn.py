from multiprocessing import cpu_count


def get_max_workers():
    return cpu_count() * 2 + 1


def get_max_treads():
    return cpu_count()


max_requests = 1000
worker_class = 'gevent'
workers = get_max_workers()
threads = get_max_treads()
