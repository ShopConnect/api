ARG NODE_VERSION=12

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 80

CMD npm start