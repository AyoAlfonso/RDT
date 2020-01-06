FROM node:8.0

WORKDIR /src

COPY ./src ./src

COPY package*.json ./

COPY ./keys.js ./
COPY ./server.js ./

RUN npm install

ENV NODE_ENV production
ENV SESSION_SECRET_KEY 2UO3
ENV HTTP_SERVER_PORT 4500
ENV HTTP_SERVER_ADDR localhost
ENV ADMIN_PASS resinadmin
ENV HTTP_SOCKET_PORT 5000

EXPOSE 3000

CMD ["npm", "start"]