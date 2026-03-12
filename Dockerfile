# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time env vars — Vite bakes these into the JS bundle at build time.
# Pass them via: docker build --build-arg VITE_API_URL=https://...
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_WS_URL=ws://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve@14

COPY --from=builder /app/dist ./dist

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000 || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]
