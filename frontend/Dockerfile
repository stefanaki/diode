FROM node:17.3

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

VOLUME [ "/api/node_modules" ]

CMD [ "npm", "run", "start" ]

