# use osgeo gdal ubuntu small 3.7 image.
# pre-installed with GDAL 3.7.0 and Python 3.10.6
FROM ghcr.io/osgeo/gdal:ubuntu-small-3.7.0

# install pip
RUN apt-get update && apt-get -y install python3-pip --fix-missing imagemagick

# set python env
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install docker-compose wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.0/wait /wait
RUN chmod +x /wait

# Download cms
ENV APP_HOME=/home/app
RUN mkdir -p $APP_HOME
ARG CMS_VERSION
ENV CMS_VERSION=$CMS_VERSION

ADD https://github.com/wmo-raf/nmhs-cms/archive/refs/tags/v$CMS_VERSION.tar.gz ./
RUN tar -xzf v$CMS_VERSION.tar.gz -C ./ && mv nmhs-cms-$CMS_VERSION/ $APP_HOME/web/ && rm v$CMS_VERSION.tar.gz

# setup working dir
WORKDIR $APP_HOME/web

# install requirements
RUN pip install --upgrade pip && pip install -r requirements.txt


COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# create tmp dir for handling large django uploads
RUN mkdir -p tmp

# Port used by this container to serve HTTP.
EXPOSE 8000


ENTRYPOINT ["./entrypoint.sh"]