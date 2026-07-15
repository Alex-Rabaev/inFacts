# inFacts

A fact-sharing social network — users post claims backed by proof links, and a reputation-weighted community credibility signal surfaces what holds up. TypeScript monorepo.

> Modernization in progress. Planning artifacts (PRD, UX, architecture spine, epics) live under `_bmad-output/planning-artifacts/`. The pre-rewrite codebase is archived under `legacy/`.

## Stack

- **Monorepo:** pnpm workspaces — `apps/api`, `apps/web`, `packages/shared`.
- **API:** NestJS 11 (TypeScript), PostgreSQL via Prisma 7, socket.io, JWT auth.
- **Web:** Vite + React 19 + TypeScript, MUI.
- **Shared:** cross-boundary DTO/contract types (`@infacts/shared`).

## Workspaces

| Package | Path | Description |
| --- | --- | --- |
| `@infacts/shared` | `packages/shared` | Canonical wire-shape types and zod contracts shared by API + web. |
| `@infacts/api` | `apps/api` | NestJS HTTP + realtime API. |
| `@infacts/web` | `apps/web` | React single-page app. |

## Getting started

### One command (Docker)

```bash
docker compose up --build
```

Brings up PostgreSQL 18, runs migrations + seed, and serves the API on
`http://localhost:3030` (Swagger at `/api/docs`) and the web app on
`http://localhost:5173` (override with `WEB_PORT=8080 docker compose up` if taken).
Postgres is exposed on host port **5433**. Seeded demo users: `admin`, `maya`,
`daniel`, `priya` (password `infacts-demo`).

### Local development

```bash
# pnpm via corepack (no global install needed)
corepack pnpm@9 install

cp .env.example .env          # fill values as needed

docker compose up -d postgres # database only

pnpm lint      # eslint across the monorepo (no `any` allowed)
pnpm test      # run every workspace's tests
pnpm build     # build every workspace

pnpm dev:api   # run the API in watch mode
pnpm dev:web   # run the web app (Vite dev server)
```

### Database (Prisma 7, `@prisma/adapter-pg`)

Schema lives in `apps/api/prisma/schema.prisma`; connection and seed are configured
in `apps/api/prisma.config.ts` (reads the root `.env`).

```bash
pnpm --filter @infacts/api run prisma:generate  # regenerate the client (also runs on build/test)
pnpm --filter @infacts/api run prisma:migrate   # create/apply a migration (dev)
pnpm --filter @infacts/api run prisma:deploy    # apply committed migrations
pnpm --filter @infacts/api run prisma:seed      # idempotent demo seed
```

## Architecture

The system follows a modular layered monolith. See the architecture spine and ADs in
`_bmad-output/planning-artifacts/architecture/` for the binding invariants.
