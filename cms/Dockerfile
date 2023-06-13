FROM python:3.9-slim-buster

USER root

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1



RUN pip install --upgrade pip && pip install setuptools==57.5.0

# Install  dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        lsb-release \
        wget \
        automake libtool pkg-config libsqlite3-dev sqlite3 \
        libpq-dev \
        libcurl4-gnutls-dev \
        libproj-dev \
        libxml2-dev \
        libgeos-dev \
        libnetcdf-dev \
        libpoppler-dev \
        libspatialite-dev \
        libhdf4-alt-dev \
        libhdf5-serial-dev \
        libopenjp2-7-dev \
    && rm -rf /var/lib/apt/lists/* 

# Install numpy
RUN pip install numpy \
# Build against PROJ master (which will be released as PROJ 6.0)
    && wget "http://download.osgeo.org/proj/proj-6.0.0.tar.gz" \
    && tar -xzf "proj-6.0.0.tar.gz" \
    && mv proj-6.0.0 proj \
    && echo "#!/bin/sh" > proj/autogen.sh \
    && chmod +x proj/autogen.sh \
    && cd proj \
    && ./autogen.sh \
    && CXXFLAGS='-DPROJ_RENAME_SYMBOLS' CFLAGS='-DPROJ_RENAME_SYMBOLS' ./configure --disable-static --prefix=/usr/local \
    && make -j"$(nproc)" \
    && make -j"$(nproc)" install 

    # Rename the library to libinternalproj
RUN mv /usr/local/lib/libproj.so.15.0.0 /usr/local/lib/libinternalproj.so.15.0.0 \
    && rm /usr/local/lib/libproj.so* \
    && rm /usr/local/lib/libproj.la \
    && ln -s libinternalproj.so.15.0.0 /usr/local/lib/libinternalproj.so.15 \
    && ln -s libinternalproj.so.15.0.0 /usr/local/lib/libinternalproj.so 
    
ARG GDAL_VERSION=3.0.4
ARG SOURCE_DIR=/usr/local/src/python-gdal

# Get latest GDAL source
RUN mkdir -p "${SOURCE_DIR}" \
    && cd "${SOURCE_DIR}" \
    && wget "http://download.osgeo.org/gdal/${GDAL_VERSION}/gdal-${GDAL_VERSION}.tar.gz" \
    && tar -xvf "gdal-${GDAL_VERSION}.tar.gz" \
    \
# Compile and install GDAL
    && cd "gdal-${GDAL_VERSION}" \
    && export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH \
    && ./configure \
            --with-python \
            --with-curl \
            --with-openjpeg \
            --without-libtool \
            --with-proj=/usr/local \
    && make -j"$(nproc)" \
    && make install \
    && ldconfig \
    \
    && cd /usr/local 
# Clean up
RUN apt-get update -y \
    && apt-get remove -y --purge build-essential wget \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf "${SOURCE_DIR}"

# create directory for the app user
RUN mkdir -p /home/app

# Set up a working directory
# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.0/wait /wait
RUN chmod +x /wait
# change to the app user
# USER app

RUN apt-get update \
    && apt-get install -y unzip


ARG CMS_VERSION=0.1.7
ADD https://github.com/wmo-raf/nmhs-cms/archive/refs/tags/v$CMS_VERSION.zip nmhs_cms.zip
RUN unzip nmhs_cms.zip -d $APP_HOME && rm nmhs_cms.zip
RUN chmod +x $APP_HOME/nmhs-cms-$CMS_VERSION

RUN mv $APP_HOME/nmhs-cms-$CMS_VERSION $APP_HOME/nmhs-cms
RUN pip install --upgrade pip && pip install -r $APP_HOME/nmhs-cms/requirements.txt
COPY entrypoint.sh $APP_HOME/nmhs-cms
WORKDIR $APP_HOME/nmhs-cms

# Port used by this container to serve HTTP.
EXPOSE 8000
# switch back to non-root user to run Gunicorn
ENTRYPOINT ["./entrypoint.sh"]