FROM ubuntu

RUN apt-get update &&  apt upgrade && apt install curl -y
RUN apt install build-essential -y
# install js exec environment
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt -y install nodejs
RUN npm install -g autorest
RUN npm install -g @microsoft/rush
RUN npm install -g draft-js-sdk-release-tools
COPY *.tgz pack.tgz
RUN npm install -g pack.tgz
COPY scripts /scripts
COPY config.json /config.json

ENTRYPOINT ["dataplane-sdk-entrypoint"]

