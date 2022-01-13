FROM node:17.3

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 9103

VOLUME [ "/api/node_modules" ]

CMD [ "npm", "run", "start" ]

