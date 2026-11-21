FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm install --no-save --force \
    @rollup/rollup-linux-arm64-musl \
    @rollup/rollup-linux-x64-musl

COPY . .
RUN npm run build

FROM alpine:3.20

WORKDIR /dist
COPY --from=build /app/dist /dist

CMD ["sh", "-c", "cp -r /dist/. /output"]
