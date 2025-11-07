FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

# Copy environment files
COPY apps/api/.env ./apps/api/

# cài deps cho cả monorepo
RUN pnpm install --frozen-lockfile

# build toàn bộ monorepo (web + api)
RUN pnpm build
# ==========================================
# Stage 2 - Runtime Production
# ==========================================
FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy node_modules chỉ cần runtime
COPY --from=builder /app/node_modules ./node_modules

# Copy build output
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/turbo.json ./turbo.json

EXPOSE 3000
EXPOSE 3002

CMD ["pnpm", "start"]