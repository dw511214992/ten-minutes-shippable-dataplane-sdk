FROM alpine

RUN apk update && apk upgrade && apk add --no-cache  git>=2.29.1-r0 curl --repository http://dl-cdn.alpinelinux.org/alpine/edge/main && apk add --no-cache python3 py3-pip make g++ bash
RUN apk add --update nodejs npm openjdk17 maven chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY scripts /scripts
RUN bash scripts/net-sdk-env-setup.sh
RUN pip3 install --upgrade wheel PyYAML requests
RUN npm install -g autorest
RUN npm install -g @microsoft/rush
RUN npm install -g draft-js-sdk-release-tools@0.1.12
COPY *.tgz pack.tgz
RUN npm install -g pack.tgz
RUN apk add
COPY .vscode-server /root/.vscode-server
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]

