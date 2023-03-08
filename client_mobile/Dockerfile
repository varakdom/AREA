FROM ubuntu:20.04

ARG ANDROID_BUILD_VERSION=31
ARG ANDROID_TOOLS_VERSION=30.0.0
ARG NODE_VERSION=18.x
ARG CMDTOOLS=commandlinetools-linux-8512546_latest.zip

ENV ANDROID_HOME=/opt/android
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin

WORKDIR /home

RUN apt-get update && apt-get install -y wget unzip openjdk-11-jdk

RUN wget -qO- https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \
    && apt-get install -y nodejs

RUN wget https://dl.google.com/android/repository/${CMDTOOLS} \
    && unzip ${CMDTOOLS} \
    && rm ${CMDTOOLS} \
    && mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && mv cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && yes | sdkmanager --licenses \
    && yes | sdkmanager "platforms;android-$ANDROID_BUILD_VERSION" "build-tools;$ANDROID_TOOLS_VERSION"

COPY ./package.json ./

RUN npm install

COPY ./ ./

WORKDIR /home/android

CMD [ "./build.sh", "/home/apk/client.apk" ]
