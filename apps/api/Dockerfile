# Build context is the repo root (see docker-compose.yml).
FROM node:24-bookworm-slim

WORKDIR /app
# openssl is required by the Prisma CLI at runtime (migrate/seed).
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

# Install with only manifests first so the layer caches across code changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter "@infacts/api..."

COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @infacts/shared run build && pnpm --filter @infacts/api run build

EXPOSE 3030

# Migrations gate startup (AD-18): deploy + seed, then serve.
CMD ["sh", "-c", "pnpm --filter @infacts/api run prisma:deploy && pnpm --filter @infacts/api run prisma:seed && pnpm --filter @infacts/api run start"]
