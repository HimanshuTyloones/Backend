FROM node:slim

WORKDIR /Backend

COPY package*.json ./

COPY . .

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 4000
