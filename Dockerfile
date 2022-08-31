FROM node:18.1.0-alpine3.15

WORKDIR /usr/src/app

COPY package.json ./
RUN npm -D install

COPY ./ ./

CMD npx nx run server:serve:production
