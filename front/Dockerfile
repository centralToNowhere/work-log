FROM node:24-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install

COPY . .

EXPOSE 5173
CMD ["yarn", "run", "dev", "--host", "0.0.0.0"]
