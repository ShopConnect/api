ARG NODE_VERSION=12

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install --production
RUN npm run build

COPY . .

EXPOSE 80

CMD node dist/main.js