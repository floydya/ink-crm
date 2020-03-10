FROM node:alpine AS build

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++

COPY ./yarn.lock /app
COPY ./package.json /app
RUN yarn install
COPY . /app
RUN yarn build

FROM abiosoft/caddy:latest

COPY --from=build /app/build /_/build

RUN chmod 755 $(find /_/build -type d) && chmod 644 $(find /_/build -type f)
