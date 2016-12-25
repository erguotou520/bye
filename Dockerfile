FROM ubuntu-upstart
COPY app/ /home/electron-ssr/app
COPY build/ /home/electron-ssr/build
COPY tasks/ /home/electron-ssr/tasks
COPY config.js /home/electron-ssr/config.js
COPY package.json /home/electron-ssr/package.json
COPY webpack.config.js /home/electron-ssr/webpack.config.js
COPY .babelrc /home/electron-ssr/.babelrc
RUN \
  sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list \
  && apt-get update -y \
  && apt-get install curl icnsutils graphicsmagick xz-utils rpm --no-install-recommends -y \
  && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" \
  && nvm install node \
  && node -v && npm -v \
  && cd /home/electron-ssr \
  && npm i \
  && npm run build:linux
VOLUME ["/home/electron-ssr/builds"]
