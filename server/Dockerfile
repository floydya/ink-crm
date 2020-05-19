FROM python:slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ARG APP_USER=appuser
ARG APP_HOME=/code/
RUN groupadd -r ${APP_USER} && useradd --no-log-init -r -g ${APP_USER} ${APP_USER}

RUN set -ex \
    && RUN_DEPS=" \
    libpcre3 \
    mime-support \
    postgresql-client \
    " \
    && seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{} \
    && apt-get update && apt-get install -y --no-install-recommends $RUN_DEPS \
    && rm -rf /var/lib/apt/lists/*

ADD Pipfile* /

RUN set -ex \
    && BUILD_DEPS=" \
    build-essential \
    libpcre3-dev \
    libpq-dev \
    git \
    " \
    && apt-get update && apt-get install -y --no-install-recommends $BUILD_DEPS \
    && pip install --upgrade pip pipenv \
    && pipenv install --system --dev --ignore-pipfile \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false $BUILD_DEPS \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
RUN chown -R $APP_USER:$APP_USER $APP_HOME

EXPOSE 8000

RUN DJANGO_SSL='' \
    CELERY_BROKER_URL='' \
    DJANGO_SECRET_KEY='CHANGEME' \
    DJANGO_DB_URL='' \
    python manage.py collectstatic --noinput

USER ${APP_USER}:${APP_USER}
ENTRYPOINT ["/code/entrypoint.sh"]
