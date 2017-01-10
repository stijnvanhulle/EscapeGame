# latest official node image
FROM ubuntu:14.04

MAINTAINER Stijn Van Hulle


ENV NODE_ENV=production
ENV PORT=3000
ENV MONGO=mongo
ENV MQTT=mqtt
ENV MONGO_PORT=27017

WORKDIR /var/python
VOLUME /var/python


RUN apt-get update && \
    apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    unzip \
    pkg-config \
    libswscale-dev \
    python3-dev \
    python3-pip \
    python3-numpy \
    libtbb2 \
    libtbb-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libjasper-dev \
    libavformat-dev \
    && apt-get -y clean all \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install paho-mqtt trollius

RUN cd / \
    && cv_version='3.2.0' \
    && wget https://github.com/Itseez/opencv/archive/"$cv_version".zip \
    && unzip "$cv_version".zip \
    && wget -O opencv_contrib.zip https://github.com/Itseez/opencv_contrib/archive/"$cv_version".zip \
    && unzip opencv_contrib.zip \

    && mkdir /opencv-"$cv_version"/cmake_binary \
    && cd /opencv-"$cv_version"/cmake_binary \
    && cmake .. -DOPENCV_EXTRA_MODULES_PATH=/opencv_contrib-"$cv_version"/modules \
    && BUILD_opencv_xfeatures2d=ON \
    && make install \
    && rm /"$cv_version".zip \
    && rm /opencv_contrib.zip \
    && rm -r /opencv-"$cv_version" \
    && rm -r /opencv_contrib-"$cv_version"
