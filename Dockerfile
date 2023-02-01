FROM node:lts
WORKDIR /usr/src/app
RUN apt-get update && apt-get install gnupg2 build-essential make gcc libc6 -y
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn run compile
LABEL org.opencontainers.image.source https://github.com/acm-uiuc/events-api
CMD [ "yarn", "run", "container-start" ]