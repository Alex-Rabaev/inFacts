# Build context is the repo root (see docker-compose.yml).
FROM node:24-bookworm-slim AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter "@infacts/web..."

COPY packages/shared packages/shared
COPY apps/web apps/web

# Vite bakes VITE_* vars at build time.
ARG VITE_API_BASE_URL=http://localhost:3030
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm --filter @infacts/shared run build && pnpm --filter @infacts/web run build

FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
