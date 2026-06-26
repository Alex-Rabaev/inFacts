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

```bash
# pnpm via corepack (no global install needed)
corepack pnpm@9 install

pnpm lint      # eslint across the monorepo (no `any` allowed)
pnpm test      # run every workspace's tests
pnpm build     # build every workspace

pnpm dev:api   # run the API in watch mode
pnpm dev:web   # run the web app (Vite dev server)
```

Copy `.env.example` to `.env` and fill values before running the API.

## Architecture

The system follows a modular layered monolith. See the architecture spine and ADs in
`_bmad-output/planning-artifacts/architecture/` for the binding invariants.
