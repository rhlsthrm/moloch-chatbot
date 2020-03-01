FROM node:12
WORKDIR /usr/
COPY package*.json ./

RUN npm install
COPY ./dist .
CMD ["node", "discordBot.js"]