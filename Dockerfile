FROM node:12
WORKDIR /usr/
COPY package*.json ./

RUN npm install
COPY ./dist .
COPY ./.env ./.env
CMD ["node", "discordBot.js"]