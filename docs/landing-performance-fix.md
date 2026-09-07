# Landing-page performance and hero correction

## Findings

The root layout explicitly forced dynamic rendering on every request, including the editorial pages. A live request to `/sell-used-car-bangalore` returned `Cache-Control: private, no-cache, no-store` and `X-Vercel-Cache: MISS`. Its measured first byte was approximately 601 ms in this session; this single request did not reproduce or fully explain the reported 5–10 second delay.

The shared layout also loaded a render-blocking Google Fonts stylesheet. Category hero images were visible on mobile and marked for eager/preload behaviour. The 14-model directory and footer used automatic prefetching, which would fan out into full route fetches when static rendering was enabled.

## Changes

- Removed the global `force-dynamic` override. Public editorial pages and the homepage now prerender; cookie/query-dependent account, orders, authentication and booking routes remain dynamic.
- Self-host Sora and Manrope with `next/font`, preserving the font families and using `display: swap`. Google Fonts is contacted at build time, not by visitors.
- Disabled automatic prefetch for model-directory links and the footer's main links, keeping them normal crawlable navigation links.
- Restored the original car hero composition: red “With Confidence” headline, three benefit cards, desktop inspection photograph, stacked mobile actions and overlapping registration form. Kept the newer substantive page content and metadata.
- Category hero photographs are desktop-only and lazy-loaded. Browser tests verify that none of these images are requested on mobile, including after scrolling. Model pages already have no hero photographs.

## Validation

Production build, focused ESLint and diff whitespace checks passed. All 60 browser checks across the performance, category, model, registration and SEO suites passed. Desktop and mobile car-hero screenshots were visually reviewed. Booking handoff, existing registration handling, unknown-route 404s and the exact legacy redirect remained functional.

Local production returned `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1` and `Cache-Control: s-maxage=31536000`; one measured first byte was approximately 46 ms. Local and live timings are not comparable benchmarks. Deployed cache headers and user-perceived speed should be checked after the hosting platform finishes rebuilding; no claim is made that this single local measurement proves the live delay has disappeared.
