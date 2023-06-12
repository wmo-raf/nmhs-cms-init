FROM node:14.20.1-bullseye-slim AS deps

RUN apt-get update && \
    apt-get install -y \
        zlib1g-dev \
        libpng-dev \ 
        unzip

# create directory for the app user
RUN mkdir -p /home/app

# Set up a working directory
ENV APP_HOME=/home/app

ADD https://github.com/wmo-raf/geomapviewer/archive/refs/heads/main.zip geomapviewer.zip
RUN unzip geomapviewer.zip -d $APP_HOME && rm geomapviewer.zip
RUN chmod +x $APP_HOME/geomapviewer-main

RUN mv $APP_HOME/geomapviewer-main $APP_HOME/geomapviewer

WORKDIR $APP_HOME/geomapviewer
# COPY package.json .
# COPY $APP_HOME/geomapviewer/yarn.lock .

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Install packages
RUN yarn install

# Stage 2: build
FROM node:14.20.1-bullseye-slim AS builder
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



RUN yarn build

# Stage 3: run
FROM node:14.20.1-bullseye-slim
ENV APP_HOME=/home/app

WORKDIR $APP_HOME/geomapviewer

COPY --from=builder $APP_HOME/geomapviewer/.next ./.next
COPY --from=builder $APP_HOME/geomapviewer/public ./public
COPY --from=builder $APP_HOME/geomapviewer/node_modules ./node_modules
COPY --from=builder $APP_HOME/geomapviewer/package.json ./
CMD ["yarn", "start"]