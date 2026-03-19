# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── galaxy-map/         # Star Wars Galaxy Map (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Artifacts

### `artifacts/galaxy-map` — Star Wars Galaxy Map

A React + Vite web app at `/`. Fetches all planets from the public SWAPI.dev API and displays them as interactive glowing markers on a dark space-themed galaxy map with an Imperial Terminal aesthetic.

**Features:**
- Interactive pan/zoom galaxy map with 60+ Star Wars planets
- Glowing cyan planet markers on deep space background with starfield
- Click any planet to open a detail panel showing climate, terrain, population, diameter, gravity, orbital period
- Residents panel fetches and lists character names from SWAPI
- Imperial Terminal aesthetic: Share Tech Mono font, glowing cyan/blue text on black, scanlines
- Terminal-style loading screen with typewriter text effects
- All data from public SWAPI.dev API — no auth or database needed

**Key files:**
- `src/pages/Home.tsx` — main layout (map + right panel)
- `src/components/galaxy-map.tsx` — interactive map with react-zoom-pan-pinch
- `src/components/planet-panel.tsx` — planet detail side panel
- `src/components/terminal-effects.tsx` — scanline overlay, terminal text animation
- `src/hooks/use-swapi.ts` — React Query hooks for SWAPI pagination and resident fetching
- `src/index.css` — Imperial Terminal theme (dark space colors, glow effects)

**Packages:** framer-motion, react-zoom-pan-pinch, clsx, tailwind-merge, @tanstack/react-query

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec and Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks from the OpenAPI spec.
