ARG NODE_VERSION=12

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY nest-cli.json .
COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
RUN npm install

COPY . .

EXPOSE 80

CMD npm start