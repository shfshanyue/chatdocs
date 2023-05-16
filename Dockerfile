FROM node:18-alpine

WORKDIR /code

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["/bin/sh", "./hack/docker-entrypoint.sh"]
