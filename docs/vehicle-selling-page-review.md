# Vehicle selling landing-page review

## Scope

Reviewed the existing `src/views/sell-used-car.tsx`, its route, registration form, booking query handling, shared navigation, metadata helper, JSON-LD, sitemap, robots file and authentication proxy. This is a repository review; it does not establish the site's current Google indexing status or live conversion rate. No Search Console data was available in this task.

## Existing page: findings and decisions

| Area | Finding | Implementation decision |
| --- | --- | --- |
| Search intent | The old `/sell-used-car` already explicitly targeted Bangalore in its metadata, hero, local section and service schema. Another car-and-Bangalore page would overlap substantially. | Permanently redirect that URL to `/sell-used-car-bangalore`, update internal links and list only the destination in the sitemap. The configuration returns HTTP 308 before rendering; the legacy page also has a redirect fallback. |
| Content depth | The page covered six valuation factors, a selling comparison, vehicle types, brands, localities, preparation and twelve FAQs. Several later paragraphs repeated inspection, offer and handover advice rather than introducing new decision-making information. | Write category-specific information around the seller's actual vehicle, with distinct inspection preparation, local logistics, valuation details and questions. Avoid a target word count and brand/locality lists added only for search phrases. |
| Conversion promises | The registration form requests an inspection; it does not query a registration database or calculate a price. “Get My Car Value” and “Sell instantly on WhatsApp” could imply more immediate functionality. | Label registration submission “Request My Car Inspection” and WhatsApp “Discuss on WhatsApp.” Keep an explicit explanation that an offer follows inspection. |
| Existing useful functionality | Registration validation supports ordinary and BH numbers, stores the number in session storage and passes it into car booking. Manual entry is available. | Retain the existing form and its handoff on the new car page. Keep personal registration data out of query strings. |
| Vehicle routing | Booking accepts `car`, `bike`, `scooter` and `commercial`. SUV is a body style under Car. | Link each page to its supported booking category. Explain the SUV selection before the click rather than sending an unsupported `vehicle=suv` parameter. |
| Structured data | The old route emitted a generic Service while the view emitted another Service, alongside FAQ data. | Emit one category-specific Service per page, visible-content-matching FAQ data, and BreadcrumbList. Reference the existing organisation identity. No invented ratings, prices or reviews. |
| Discoverability | Footer car and bike links led to generic pickup; it lacked the five requested landing-page links. | Add a “Sell in Bangalore” footer column with all five exact URLs. Add contextual sibling links on each page. |
| Rendering | The existing page's main content was server rendered, which is useful for both search crawlers and users without JavaScript. | Keep all editorial content, links and native FAQ disclosures server rendered. Only the retained registration form needs client-side interaction. |
| Public-route infrastructure | The proxy excluded the old public route explicitly; the new routes would otherwise initialise authentication and call the auth service. | Add narrowly scoped exclusions for the five public URLs. Private-route behaviour is unchanged. |
| Presentation | The original used a dark hero, red accents, generous cards and responsive grids. | Continue that visual language with existing category-specific WebP assets, visible breadcrumbs, section navigation and repeated inspection CTAs. |
| Local relevance | Locality names alone did little to distinguish one seller's task from another. | Add practical Bangalore visit planning: apartment access for cars, space around motorcycles, shared scooter availability, SUV parking clearance, and yard/depot access for commercial vehicles. Availability remains subject to confirmation. |

## Content differentiation

- **Car:** hatchbacks and sedans; exact transmission/variant; parking damage; service evidence; relocation scheduling. The SUV guide carries the deeper SUV-specific topics.
- **Bike:** starting and gearbox behaviour; chain, sprockets and clutch; fork and brake history; aftermarket parts; riding gear and included accessories.
- **Scooter:** petrol automatic-drive behaviour versus electric battery/charging information; real-use range context; seat/storage locks; charger ownership; connected accounts.
- **SUV:** drive system and seating configuration; underbody and suspension history; rough-road use; all-row cabin access; removable touring equipment.
- **Commercial:** duty cycle; load body and specialist equipment; business authority; operating records; fleet enquiries; downtime and yard access.

The pages share a layout and basic service process because they belong to the same service. Their substantive copy is authored separately, rather than generated by substituting vehicle names. This is not a claim that no similar sentence exists elsewhere on the web, nor a guarantee that Google will index every page.

## SEO implementation

Each destination has a distinct title, description, H1, self-referencing canonical, Open Graph URL and category image. The sitemap exposes all five canonical destinations, robots permits public crawling, and the footer provides ordinary crawlable HTML links. No artificial update timestamps or false structured-data claims were added.

Google can select its own canonical despite publisher signals. Unique wording alone does not ensure a useful page: the vehicle-specific advice must continue to reflect the actual service offered. FAQ markup describes visible content; its presence does not promise a rich search result.

References consulted:

- [Google: canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Google: consolidating duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: doorway pages](https://developers.google.com/search/blog/2015/03/an-update-on-doorway-pages)
- Installed Next.js 16.3.4 documentation: metadata, page conventions, redirects and permanentRedirect.

## Validation and publication follow-up

The focused browser suite checks every page without JavaScript, canonical metadata, sitemap inclusion, the legacy 308 response, one Service schema per page, FAQ schema/content agreement, footer destinations, booking category URLs, image loading, browser errors and horizontal overflow at 320, 390, 768 and 1440 pixels. The existing car tests retain registration validation and booking persistence coverage with updated labels and canonical URLs.

Completed validation: `npm run build` passed, including TypeScript; ESLint passed for the new landing-page source and footer; `git diff --check` passed. `npx playwright test tests/e2e/vehicle-selling.spec.ts tests/e2e/car-landing.spec.ts tests/e2e/seo-launch.spec.ts` passed all 34 tests. Mobile screenshots were captured for all five categories, and the car page screenshot was visually reviewed. This does not measure field Core Web Vitals or verify external indexing.

After deployment, inspect each canonical URL in Google Search Console, confirm the live redirect and sitemap, and monitor indexing reasons and Google-selected canonicals. Search Console submission and production deployment are not performed by these repository changes. Real customer evidence, supported vehicle eligibility and verified service information should guide future content additions.
