## Device Buyback System (Cashify-style) — Laptops first, reusable for any category

A complete sell-your-device flow: admin catalog + valuation engine, plus a public evaluation funnel ending in a booking. Built generic (category-scoped) so phones/tablets can be added later, launched with **Laptops**.

### How the price is calculated (the "top brand" strategy)
Cashify/Cashfy-style model = **base price per exact model − condition deductions + accessory bonuses**:
1. Each model has an admin-set **base price** (best-case quote).
2. The user answers grouped questions; each selected option carries a **deduction** (fixed ₹ or %) or a **bonus** (e.g. bill/box present).
3. Final quote = base − all deductions + bonuses, floored at a minimum.
Admin fully controls base prices and every deduction/bonus, so the strategy is tunable.

### Database (new tables, all category-scoped & reusable)
```text
device_categories   Laptop, Phone…  (name, slug, icon, active, sort)
device_brands       → category      (name, slug, logo, active, sort)
device_series       → brand         (name, slug, active, sort)
device_models       → series        (name, slug, base_price, image, active, sort)
condition_groups    → category      (title, key, type single/multi, step, sort)
condition_options   → group         (label, desc, kind deduct/percent/bonus, value, sort)
device_orders       snapshot fields (model/brand/series names, base, deductions json,
                                     final_price, name, phone, email, pincode, address,
                                     status, user_id)
```
RLS: public `anon`+`auth` SELECT on active catalog rows (no `has_role` for anon — avoids 42501); admin-only writes via `has_role`; orders = public INSERT, users see own, admins all (mirrors `leads`). GRANTs included. Seed Laptops with default condition groups (Power-on, Functional issues, Physical grade, Age, Accessories) + sensible deductions, and a couple of demo brands/series/models.

### Admin dashboard — new "Devices" tab
A `DevicesPanel` with a category switcher (defaults to Laptop) and sub-tabs:
- **Brands** — card grid, add/edit, logo upload (client-compressed data URL, same pattern as listings), reorder, active toggle.
- **Series** — pick brand → manage its series.
- **Models** — pick brand+series → add models with base price + image.
- **Pricing** — manage condition groups & options (the deduction/bonus values) with a clean editor.
- **Orders** — buyback bookings table with status (new/contacted/scheduled/paid/rejected), customer + device + quoted price, detail drawer.
Best-effort polished UI: search, inline edit dialogs, empty states.

### Public evaluation flow — `/sell/$category` (launch `/sell/laptops`)
- **Hero** matching site style (navy gradient, Sora), H1 targeting **"Sell Old Laptop in Bangalore"**, sub-CTA + **pincode** check, trust stats.
- **Brand grid** pulled live from admin → click brand.
- Step funnel (modern, mobile-first, progress bar): **Brand → Series → Model → Condition questions (power, issues, grade, age, accessories) → Live price reveal → Booking form** (name, phone, email, address, pincode, preferred slot) → saves a `device_order`.
- Live quote updates as options are picked; animated price reveal.
- Supporting sections: how-it-works (3 steps), why-us, FAQ, Bangalore-localised copy. SEO `head()` with Bangalore keywords + JSON-LD.
- Nav link "Sell Laptop" added.

### Technical notes
- Helpers in `src/lib/device-buyback.ts` (hooks: categories/brands/series/models/condition-groups/orders, `calculateQuote`, `formatPrice`, `slugify`, reuse `compressImage`).
- Routes: `src/routes/sell.$category.tsx` (ssr on, public, live data, SEO). Funnel state client-side.
- Memory updated with the new schema, routes, and pricing model.

### Scope notes
- Logos/model images stored inline as compressed data URLs (no storage bucket in this env — same as listings).
- Launches with Laptops seeded; new categories are pure data (no code) once schema is in.

I'll start with the migration, then build admin, then the public funnel.