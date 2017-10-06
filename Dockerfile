FROM mhart/alpine-node:8.6.0

RUN apk update

# Install build tools (necessary for node-gyp)

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++

# Install youtube-dl

RUN set -x \
 && apk add --no-cache ca-certificates curl ffmpeg lame python \
    # Install youtube-dl
    # https://github.com/rg3/youtube-dl
 && curl -Lo /usr/local/bin/youtube-dl https://yt-dl.org/downloads/latest/youtube-dl \
 && chmod a+rx /usr/local/bin/youtube-dl \
    # Clean-up
 && apk del curl \
    # Create directory to hold downloads.
 && mkdir /downloads \
 && chmod a+rw /downloads \
    # Basic check it works.
 && youtube-dl --version

ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

# End: Install youtube-dl

RUN npm i -g nodemon

COPY package.json yarn.lock /opt/app/
ENV node_path ./lib
WORKDIR /opt/app
RUN yarn
RUN apk del .gyp
COPY . /opt/app/
RUN if [ -d ~/storage ]; then rm -rf storage; fi
RUN rm -rf /var/cache/apk/*
ENTRYPOINT ["node", "start.js", "-c", "tubecast.conf.json"]
