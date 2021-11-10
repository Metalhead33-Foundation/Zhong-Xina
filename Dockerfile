FROM node:17 AS builder
RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --lockfile-only
COPY src/ /app/src/
COPY tsconfig.json /app/
RUN yarn build

FROM node:17-alpine3.14

RUN mkdir /app
WORKDIR /app

COPY --from=builder /app/built/ /app/
COPY --from=builder /app/node_modules/ /app/node_modules/

ENTRYPOINT ["node", "./bot.js"]
