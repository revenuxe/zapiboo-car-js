# Zapiboo

Next.js App Router website for buying and selling used vehicles in Bangalore. All page routes render on the server, with Supabase cookie authentication and interactive booking and administration tools.

The original design and content are preserved from commit `bc9b500`.

## Setup

Use Node.js 22 or 24. Copy `.env.example` to `.env.local`, supply the public Supabase credentials, then run:

```sh
npm ci
npm run dev
```

## Production and validation

Build and run the production server:

```sh
npm run build
npm start
```

Validation: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run test:e2e`, and `node scripts/verify-preservation.mjs`. Browser tests require `npx playwright install chromium`.

See [migration and deployment notes](docs/nextjs-migration.md) for the Supabase callback allowlist, environment-variable transition, SSR architecture, and integration-test limits.
