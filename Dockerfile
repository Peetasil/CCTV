# Builder stage
FROM node:18.17.0-alpine AS builder

WORKDIR /app

# Use .dockerignore to exclude unnecessary files
COPY package.json /app

RUN npm install

COPY . /app

RUN npx prisma generate && \
    npm run build && \
    npm prune --production

# Final image
FROM node:18.17.0-alpine

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/.nuxt ./.nuxt/
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/nuxt.config.ts ./nuxt.config.ts

ENTRYPOINT ["node", ".output/server/index.mjs"]
