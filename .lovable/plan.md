## Goal

Two tracks: (1) clean, high-traffic SEO across all laptop landing pages + more model pages, and (2) a robust, Cashify-style configuration + valuation engine that asks brand-aware specs (processor, RAM, storage, GPU) before condition questions.

---

## Track A — SEO cleanup & expansion

### 1. Fix broken H1s
Current brand H1 renders "Sell Your Used in Bangalore Apple MacBook Laptop in Bangalore" because of a fragile `headline.replace(brand.name, "")` + re-append. Replace with a single clean, keyword-first H1 per page:
- Brand page: **"Sell Old {Brand} Laptop in Bangalore"** (plain, one gradient accent on the brand word only, no duplicate "in Bangalore").
- Area page: **"Sell Used Laptop in {Area}, Bangalore"**.
- Add a matching, keyword-rich subtitle line.

Add a `h1`/`heroTitle` field to `laptop-brands.ts` so copy is data-driven, not string-manipulated.

### 2. Model-level SEO pages
Add per-model detailed content pages linked from each brand page:
- New route `src/routes/sell-old-laptop.$brand_.$model.tsx` (SEO content page — separate from the transactional funnel at `/sell/laptops/...`).
- Extend `laptop-brands.ts` model entries from plain strings to objects `{ slug, name, blurb, priceRange, specsIntro }` so each has real content.
- Each model page: keyword H1 ("Sell {Model} in Bangalore"), 2–3 content paragraphs, price range, spec/condition notes, FAQ, and a primary CTA that deep-links into the correct funnel series/model (or brand series picker when exact model isn't in DB).
- Brand pages get a "Popular {Brand} models" grid linking to these model pages (more internal links).

### 3. Full technical SEO pass
- `Product`/`Service` + `BreadcrumbList` + `FAQPage` JSON-LD on brand and model pages; `ItemList` on brand page listing models.
- Self-referencing canonical + `og:url` on every new page.
- Add all brand-model URLs to `sitemap[.]xml.ts`.
- Internal link mesh: area pages ⇄ brand pages ⇄ model pages ⇄ funnel.
- Confirm SSR renders content (loader-driven, no client-only gating on content).

---

## Track B — Configuration-aware valuation engine (Cashify-style)

### Data model (new migration)
1. `device_brands` gets a `platform` column: `apple` | `windows` (drives which processor specs apply).
2. New table `spec_groups` — configuration questions, brand-platform aware:
   `id, category_id, platform (null=all | apple | windows), key, title, subtitle, selection, step_order, active`.
3. New table `spec_options`:
   `id, group_id, label, description, kind, value, sort_order` (reuses existing `deduct_fixed | deduct_percent | bonus_fixed` kinds).
4. Optional `device_models.year` (int, nullable) to power age depreciation.

All tables get GRANTs (anon SELECT for public read, authenticated + service_role) and RLS: public SELECT on active rows, admin write via `has_role`.

Seed default spec groups for laptops:
- **Processor** — platform `apple`: M1/M2/M3/M4, Intel Core (older). platform `windows`: Intel Core i3/i5/i7/i9 and AMD Ryzen 3/5/7/9, plus a generation follow-up.
- **RAM** — 4/8/16/32/64 GB (8GB baseline).
- **Storage** — HDD 500GB/1TB, SSD 256GB/512GB/1TB/2TB.
- **Graphics** — Integrated / Dedicated GPU.

### Pricing engine v2 (`device-buyback.ts`)
Replace `calculateQuote` with a Cashify-style pipeline:

```text
start   = model.base_price               (reference/top-config value)
config  = base + Σ spec impacts          (processor/RAM/storage/GPU deltas)
aged    = config × (1 − ageDepreciation) (from model.year, capped)
final   = aged − Σ condition deductions + Σ accessory bonuses
final   = clamp(final, floor)  then round to nearest ₹100
```
- Percent impacts always compute off `base` (stable, predictable).
- Age depreciation table (e.g. 0–1yr 0%, 1–2yr 8%, 2–3yr 15%, 3–4yr 25%, 4yr+ 35%, capped).
- Floor at ~5% of base so quotes never go absurd.
- Return a full breakdown (spec + condition + age lines) for a transparent "how we calculated this" view on the result screen.

### Evaluation flow (`sell.$category_.$brand_.$series_.$model.tsx`)
New phase order: `intro → configuration (spec steps) → condition (existing) → result → login → booking`.
- Load `spec_groups` filtered by category + brand platform; render as stepper steps before condition steps.
- Result screen shows an itemized breakdown (config chosen, condition adjustments, age, final price).
- Persist spec selections in the same sessionStorage draft that already survives the login round-trip.
- Store chosen specs into `device_orders.selections` (already a JSON array — extend to tag spec vs condition).

### Admin
- New **Specs** manager (mirrors `PricingManager` UI) in the Devices tab: manage spec groups/options per category with platform selector.
- Brand editor gets a platform (Apple/Windows) selector.
- Model editor gets an optional year field.

---

## Files (high level)
- **Migration**: `platform` on brands, `spec_groups`, `spec_options`, `device_models.year`, grants/RLS, seed data + regenerate `types.ts`.
- **Edit**: `src/lib/device-buyback.ts` (spec hooks + engine v2), `src/lib/laptop-brands.ts` (structured models + h1), `src/routes/sell-old-laptop.$brand.tsx` (H1 + model grid + schema), `src/routes/sell-used-laptop.$area.tsx` (H1), `sell.$category_.$brand_.$series_.$model.tsx` (config phase + breakdown), `sitemap[.]xml.ts`, admin Devices panel + Brands/Models managers.
- **New**: `src/routes/sell-old-laptop.$brand_.$model.tsx`, `src/components/admin/devices/SpecsManager.tsx`.

## Notes / decisions to confirm
- Model SEO pages will be driven by curated static content in `laptop-brands.ts` (crawlable, SSR) and deep-link into the DB funnel — keeps SEO pages fast and always-rendered even when DB models vary.
- Spec deltas seed with sensible starting values; you tune exact ₹ amounts in the admin Specs manager.
