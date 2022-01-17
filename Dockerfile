FROM ubuntu:20.04

RUN apt-get update &&  apt upgrade && apt install curl -y
RUN apt install build-essential -y

# install java
ENV JAVA_HOME /usr/java/openjdk-17
ENV PATH $JAVA_HOME/bin:$PATH
ENV LANG en_US.UTF-8
ENV JAVA_VERSION 17.0.1
RUN curl -fL -o openjdk.tgz https://download.java.net/java/GA/jdk17.0.1/2a2082e5a09d4267845be086888add4f/12/GPL/openjdk-17.0.1_linux-x64_bin.tar.gz
RUN mkdir -p "$JAVA_HOME"
RUN tar --extract --file openjdk.tgz --directory "$JAVA_HOME" --strip-components 1 --no-same-owner
RUN rm openjdk.tgz
## install maven
ENV M2_HOME /usr/maven
ENV MAVEN_HOME=/usr/maven
ENV PATH $M2_HOME/bin:$PATH
RUN mkdir -p "$MAVEN_HOME"
RUN curl -fL -o maven.tgz https://dlcdn.apache.org/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.tar.gz
RUN tar --extract --file maven.tgz --directory "$MAVEN_HOME" --strip-components 1 --no-same-owner
RUN rm maven.tgz

# install node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt -y install nodejs

# install git
RUN apt install git -y

# install python
RUN apt install python3-pip -y && apt install python3-venv -y && pip3 install --upgrade pip

# install chrome
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# install powershell
RUN apt-get install -y wget apt-transport-https software-properties-common
RUN wget -q https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN apt-get update && apt-get install -y powershell
RUN rm packages-microsoft-prod.deb

# install .NET
RUN wget https://dotnet.microsoft.com/download/dotnet/scripts/v1/dotnet-install.sh && chmod 777 ./dotnet-install.sh
RUN bash ./dotnet-install.sh
RUN bash ./dotnet-install.sh -c 3.1
ENV DOTNET_ROOT=/root/.dotnet PATH=$PATH:/root/.dotnet
RUN rm /dotnet-install.sh

# install depended packages
RUN pip3 install --upgrade wheel PyYAML requests
RUN npm install -g typescript
RUN npm install -g autorest
RUN npm install -g @microsoft/rush
RUN npm install -g draft-js-sdk-release-tools@0.1.13
COPY *.tgz pack.tgz
RUN npm install -g pack.tgz
COPY .vscode-server /root/.vscode-server
COPY entrypoint.sh /entrypoint.sh

# config git
RUN git config --global credential.helper store

ENTRYPOINT ["bash", "/entrypoint.sh"]

