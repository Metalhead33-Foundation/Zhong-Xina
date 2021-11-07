FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install
COPY src/ /app/src/
ENTRYPOINT ["node", "src/bot.js"]
