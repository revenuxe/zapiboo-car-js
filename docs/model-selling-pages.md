# Model selling pages

Added 14 dedicated pages: eight cars/SUVs, three motorcycle guides and three scooter guides. The five URLs requested by the user are preserved exactly. Additional models are Dzire, Baleno, Wagon R, Brezza, Nexon, Splendor Plus, Pulsar, Jupiter and Access 125.

## Navigation and routing

The “Sell by model” section appears immediately before the footer wherever the existing public site shell displays the footer. Its 14 links are grouped into Cars & SUVs, Bikes and Scooters and render without JavaScript. Authentication/admin screens retain their existing layout.

Each page has an explicit App Router route, a self-referencing canonical, a unique title and description, matching Open Graph metadata, a three-level breadcrumb, one Service schema and FAQs matching the visible content. All model URLs are in the sitemap. Unknown model paths return 404; the existing exact `/sell-used-car` redirect does not match nested model URLs. Bike and scooter model routes are excluded from authentication proxy work, like the existing car route.

Booking buttons open the supported vehicle category. SUV models open Car and explain the SUV body-style selection. Brand, model and year remain inputs in the existing booking flow; the landing pages do not claim to automatically prefill a model or calculate a price. Model-specific WhatsApp enquiries include the model name.

## Editorial approach and research

The directory is labelled “Sell by model,” not as a ranked list of Bangalore's most-traded used vehicles. National new-vehicle sales informed the selection but do not establish local used-market demand. No sales counts, resale-price guarantees or “we buy every model” claims are published.

Selection references:

- [Autocar India: FY2026 best-selling cars](https://www.autocarindia.com/car-news/top-10-bestselling-cars-in-fy2026-sedan-in-pole-position-439450)
- [Autocar India: June 2026 two-wheeler registrations](https://www.autocarindia.com/industry-amp/two-wheeler-registrations-grew-21-percent-yoy-in-june-2026-440184)
- [Autocar India: Jupiter sales milestone](https://www.autocarindia.com/industry-amp/tvs-jupiter-crosses-9-million-sales-milestone-439563)

Manufacturer references used to verify version distinctions, without copying promotional descriptions or assuming current specifications apply to older vehicles:

- [Maruti Suzuki: AGS model coverage](https://www.marutisuzuki.com/corporate/technology/automatic)
- [Maruti Suzuki: 2017 Dzire](https://www.marutisuzuki.com/corporate/media/press-releases/2017/may/all-new-dzire-is-here-to-redefine-the-market)
- [Maruti Suzuki: Wagon R brochure](https://www.marutisuzuki.com/-/media/files/maruti/documents/wagonr_brochure.ashx?modified=20190301080201)
- [Hyundai: Creta powertrain choices](https://www.hyundai.com/in/en/find-a-car/creta/performance)
- [Honda Cars: City and e:HEV FAQ](https://www.hondacarindia.com/honda-city/faq)
- [Royal Enfield: 2021 Classic 350 launch](https://www.royalenfield.com/content/dam/royal-enfield/india/our-world/news-and-media/press-release/product-launches/all-new-classic-350/all-new-classic-350-launch-release-sept%202021.pdf)
- [Honda: scooter model range](https://www.honda2wheelersindia.com/scooter)
- [TVS: Jupiter range](https://www.tvsmotor.com/tvs-jupiter/-)
- [Suzuki: Access 125](https://www.suzukimotorcycle.co.in/product-details/all-new-access-125-bluetooth-enabled)
- [Suzuki: e-ACCESS](https://www.suzukimotorcycle.co.in/campaign/e-access)

Each model has independently written identification advice, three assessment topics, a preparation checklist, local inspection planning and three FAQs. Shared transaction guidance describes the same actual service. No alleged model-wide mechanical defects, service intervals, unsupported prices or exact equipment guarantees are introduced. Technical advice asks sellers to describe observed condition and provide records. Generic category images are not presented as photographs of a particular model.

## Validation scope

The model browser suite covers every URL without JavaScript, metadata, schema/content agreement, directory links above the footer, sitemap coverage, unknown-route 404s, the exact legacy redirect, homepage/category navigation, responsive layouts and category handoff into booking. Catalogue responses are mocked for the handoff checks so they do not depend on live vehicle inventory or create real bookings.

Validation completed: production build (including TypeScript), focused ESLint checks and `git diff --check` passed. All 53 browser tests across the model, category, car-registration and SEO suites passed. Mobile screenshots were captured and the model directory was visually reviewed.

No deployment or Search Console submission is included. After publication, inspect the live URLs and sitemap in Search Console and monitor the selected canonicals. Model-specific content and technical signals cannot guarantee indexing.
