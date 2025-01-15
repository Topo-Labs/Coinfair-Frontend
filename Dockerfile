# Stage 1: Build Stage
FROM node:20 AS builder

WORKDIR /app

RUN npm install -g npm@latest && \
    corepack enable && \
    corepack prepare yarn@3.1.0 --activate

COPY . .

RUN yarn install

RUN yarn build

# Stage 2: Production Stage
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/dist/standalone ./
COPY --from=builder /app/dist/static ./dist/static

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

#  docker build -t coinfair-fronted .
#  docker run -d --name coinfair-fronted -p 3000:3000 coinfair-fronted