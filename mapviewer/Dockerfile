FROM node:16.16.0-bullseye-slim AS deps

RUN apt-get update && \
    apt-get install -y \
        zlib1g-dev \
        libpng-dev \ 
        unzip

# create directory for the app user
RUN mkdir -p /home/app

# Set up a working directory
ENV APP_HOME=/home/app

ADD https://github.com/wmo-raf/geomapviewer/archive/94c31b61291d5d05e2ff7e3940ad6cc39e530290.zip geomapviewer.zip
RUN unzip geomapviewer.zip -d $APP_HOME && rm geomapviewer.zip
RUN chmod +x $APP_HOME/geomapviewer-94c31b61291d5d05e2ff7e3940ad6cc39e530290

RUN mv $APP_HOME/geomapviewer-94c31b61291d5d05e2ff7e3940ad6cc39e530290 $APP_HOME/geomapviewer

WORKDIR $APP_HOME/geomapviewer
# COPY package.json .
# COPY $APP_HOME/geomapviewer/yarn.lock .

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Install packages
RUN yarn install

# Stage 2: build
FROM node:16.16.0-bullseye-slim AS builder
RUN apt-get update && apt-get install -y libgl1 libxi6
ENV APP_HOME=/home/app

WORKDIR $APP_HOME/geomapviewer
COPY --from=deps $APP_HOME/geomapviewer/node_modules ./node_modules
COPY --from=deps $APP_HOME/geomapviewer .
# COPY --from=deps public ./public
# COPY $APP_HOME/geomapviewer/package.json $APP_HOME/geomapviewer/next.config.js $APP_HOME/geomapviewer/jsconfig.json ./

# Env Variables that should be available at build time
ARG ANALYTICS_PROPERTY_ID
ENV ANALYTICS_PROPERTY_ID $ANALYTICS_PROPERTY_ID

ARG BITLY_TOKEN
ENV BITLY_TOKEN $BITLY_TOKEN

ARG DEBUG
ENV DEBUG $DEBUG

ARG GOOGLE_CUSTOM_SEARCH_CX
ENV GOOGLE_CUSTOM_SEARCH_CX $GOOGLE_CUSTOM_SEARCH_CX

ARG GOOGLE_SEARCH_API_KEY
ENV GOOGLE_SEARCH_API_KEY $GOOGLE_SEARCH_API_KEY

ARG CMS_API
ENV CMS_API $CMS_API

ARG BASE_PATH
ENV BASE_PATH $BASE_PATH

RUN yarn build

# Stage 3: run
FROM node:16.16.0-bullseye-slim
ENV APP_HOME=/home/app

WORKDIR $APP_HOME/geomapviewer

COPY --from=builder $APP_HOME/geomapviewer/.next ./.next
COPY --from=builder $APP_HOME/geomapviewer/public ./public
COPY --from=builder $APP_HOME/geomapviewer/node_modules ./node_modules
COPY --from=builder $APP_HOME/geomapviewer/package.json ./
CMD ["yarn", "start"]