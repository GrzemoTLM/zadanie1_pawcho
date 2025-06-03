FROM node:20-alpine3.19 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@10.9.0 && \
    npm uninstall -g cross-spawn || true && \
    npm cache clean --force && \
    find /usr/local/lib/node_modules -name "cross-spawn" -type d -exec rm -rf {} + && \
    npm install -g cross-spawn@7.0.5 --force && \
    npm config set save-exact=true && \
    npm config set legacy-peer-deps=true && \
    npm install --only=production

FROM node:20-alpine3.19 AS runner

WORKDIR /app

RUN npm install -g npm@10.9.0 && \
    npm uninstall -g cross-spawn || true && \
    npm cache clean --force && \
    find /usr/local/lib/node_modules -name "cross-spawn" -type d -exec rm -rf {} + && \
    npm install -g cross-spawn@7.0.5 --force && \
    npm config set save-exact=true && \
    npm config set legacy-peer-deps=true

COPY --from=builder /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

CMD ["npm", "start"]
