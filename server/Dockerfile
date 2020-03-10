FROM python:3.8.0-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /home/app

# create app user
RUN addgroup -S app && adduser -S app -G app

ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev git \
    jpeg-dev zlib-dev freetype-dev lcms2-dev \
    openjpeg-dev tiff-dev tk-dev tcl-dev \
    harfbuzz-dev fribidi-dev libpq

COPY ./Pipfile* $APP_HOME/
RUN pip install --upgrade pip pipenv
RUN pipenv install --system --dev --ignore-pipfile
RUN pip install --upgrade gunicorn

COPY ./entrypoint.sh $APP_HOME
COPY . $APP_HOME
RUN chown -R app:app $APP_HOME

USER app

ENTRYPOINT ["/home/app/web/entrypoint.sh"]