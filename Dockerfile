FROM node:18-alpine AS builder

LABEL org.opencontainers.image.title="Zadanie1_PAWCHO"
LABEL org.opencontainers.image.description="Aplikacja pogodowa - Zadanie 1 PAWCHO"
LABEL org.opencontainers.image.authors="Grzegorz Łukomski <grzegorz.lukom@gmail.com>"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN npm install --only=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

CMD ["npm", "start"]