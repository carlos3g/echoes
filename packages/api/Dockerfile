# see: https://hackernoon.com/5-steps-for-dockerizing-nestjs-with-prisma
# see: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:20
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile
COPY . .
RUN npx prisma generate
