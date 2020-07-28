FROM node:latest

WORKDIR /usr/src/core

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]