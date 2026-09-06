# Next.js migration

The project uses Next.js 16.3.4 App Router and React 19. SWR handles interactive data fetching; small React command hooks handle user-triggered writes. Server Components provide initial data using SWR fallback, while account-scoped caches are replaced on authentication changes.

## Rendering and preservation

All 11 existing page URLs use request-time SSR through the root layout's `force-dynamic` setting. The sitemap is generated separately. Public content is present in the initial HTML; interactive forms, menus, maps, and animations hydrate normally. The homepage, car-selling page, price guide, and legal pages use Server Components with client components where needed.

The original page JSX, copy, class names, stylesheet, assets, and navigation destinations are preserved. The homepage hero uses Next Image with the same source and dimensions, responsive delivery and preload. A no-JavaScript style makes animation-hidden content visible without changing the hydrated design.

Run `node scripts/verify-preservation.mjs` to compare the page JSX and stylesheet against restoration commit `bc9b500`.

## Authentication and integrations

Supabase browser and server clients now share cookie-based authentication using `@supabase/ssr`. Proxy refreshes sessions; server pages validate users with `getUser`. Account access is checked before rendering. Admin access additionally checks the existing `user_roles` table with the user's credentials and RLS. The admin booking list and pickup categories are fetched on the server and hydrated into a request-scoped query cache. Subsequent selection and tab interactions retain the existing Supabase queries and mutations.

OAuth and confirmation redirects use `/auth/callback`, which exchanges the PKCE code and validates the destination as a same-origin path. Existing localStorage-only logins require signing in again after migration.

The existing Supabase schema, RLS policies, edge functions, and data are unchanged. S3 uploads remain disabled as in the original project. The unused local signing action and service-role client have been removed; the existing upload integration uses the Supabase edge function if enabled. The daily Vercel keepalive route and schedule remain.

## SEO

Each page has server metadata, an absolute canonical URL, Open Graph and Twitter metadata. Private pages have noindex directives. Organization, website, service and breadcrumb JSON-LD remain, with valid favicon references. The sitemap now includes `/sell-used-car` and excludes private routes. Unknown URLs return HTTP 404.

## Deployment

Use Node.js 22 or 24, `npm ci`, `npm run build`, and `npm start`. On Vercel select the Next.js framework preset and remove any previous project-level build command or output-directory overrides. Keep the existing cron configuration.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` before building. Only native Next.js public variable names are supported. Local credentials are stored in ignored `.env.local`; `.env.example` documents the supported values. Never expose service-role or AWS secrets through public variables.

Add `https://www.zapiboo.com/auth/callback` and the appropriate preview/local callback URLs to the Supabase Auth redirect allowlist. The Google provider callback configured at Google remains Supabase's callback. Verify confirmation email and Google OAuth with a real test account before release.

## Validation

- `npm run build`: production build and Next TypeScript checks.
- `npm run typecheck`: standalone TypeScript validation.
- `npm run lint`: source lint checks.
- `npm run test:unit`: redirect safety tests.
- `npm run test:e2e`: production-server SSR, metadata, images, hydration, redirects, 404, sitemap, mobile menu, auth tabs and booking interaction checks.

Tests do not submit live enquiries, create accounts, or mutate production records. Booking interaction tests use controlled catalogue responses. Real authenticated admin/customer workflows, OAuth, email delivery and disabled S3 uploads need their configured services and credentials for full integration verification.

Local results: production build, TypeScript, lint, 24 browser tests, four unit tests (redirect safety and write sequencing), and all 11 page-markup comparisons passed. The stylesheet comparison also passed. Browser checks always start an isolated production server on port 3100. Direct catalogue access returned `fetch failed` from this environment, so live catalogue availability is unverified. Desktop and mobile screenshots of the migration were captured, but an additional baseline installation was blocked by automatic approval review due to a session usage limit; pixel-level before/after equality is not claimed.

Old framework folders, dependency caches, previous build output, and the temporary original-source comparison copy have been removed. Local environment values were preserved in ignored `.env.local`, and the tracked `.env` is deleted from the working tree. No cleanup changes have been pushed or deployed.

The final production browser run reported all 24 checks successful, but its temporary-server teardown stalled in this Windows environment and the runner was interrupted. The checks completed; a clean runner exit is not claimed for that run.

References: [SWR with Next.js](https://swr.vercel.app/docs/with-nextjs), [Next.js metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client).
