## HuluMart — Admin system, dynamic rates & booking map

### 1. Enable Lovable Cloud (backend)
Bookings currently only show a toast — nothing is stored, so there's nothing to manage. We enable Lovable Cloud to get a database + auth, then everything below becomes real.

### 2. Database
Tables (all with proper RLS + grants):

- `leads` — every pickup booking: scrap type (mixed/specific), items, size tier, photo flag, locality, pincode, address, landmark, name, phone, preferred date, slot, lat/lng, status (`new` / `contacted` / `scheduled` / `done` / `cancelled`), notes, created_at.
- `scrap_categories` — name, slug, icon, sort order, active.
- `scrap_rates` — links to a category: item name, price (₹), unit (e.g. /kg), active, updated_at.
- `user_roles` + `app_role` enum + `has_role()` — admin access control (no roles on profiles).

Public users can INSERT a lead (booking) and SELECT active rates/categories. Only admins can read leads or write rates/categories.

### 3. Public booking flow changes (`/pickup`)
- On submit, the booking is saved to `leads` (still shows the friendly success screen + WhatsApp).
- **Interactive map card** added to the location step: an OpenStreetMap/Leaflet map with a draggable pin and a "Use my current location" button that fetches the browser's GPS, drops the pin, and stores lat/lng with the lead. (Free, no API key needed.)
- Rates shown on Home/Materials read live from `scrap_rates` so prices stay in sync with the admin.

### 4. Admin auth (`/admin/login`)
- Email + password login on a clean, compact card.
- Only users with the `admin` role can reach the dashboard; everyone else is redirected.
- First admin is seeded so you can log in immediately (credentials shared after build).

### 5. Admin dashboard (`/admin/dashboard`)
Tabbed, mobile-friendly layout:

- **Leads** — table/list of all bookings with status chips, search & status filter, and a small **eye icon** on each row.
  - Clicking the eye opens a **compact rounded modal** (mobile-style sheet) showing full lead details, where you can update status, add notes, and **delete** the lead.
- **Rates** — list of scrap items grouped by category; inline edit price/unit, toggle active, add new item. Saves update the live site instantly.
- **Categories** — add / rename / reorder / activate scrap categories.

### Technical notes
- Saving/reading leads, rates, categories goes through TanStack `createServerFn` (admin reads via `requireSupabaseAuth` + `has_role` check); public lead insert + active-rate reads via safe server functions.
- Map uses `leaflet` + OpenStreetMap tiles (no key) and the browser Geolocation API; rendered client-only to avoid SSR issues.
- New routes: `/admin/login`, and `/admin/dashboard` under the managed `_authenticated` layout.
- Reverse-geocoding the pin to a readable address is optional; default is lat/lng + manual address (kept simple, no extra keys).

Want me to proceed with this? If you'd prefer Google Maps instead of the free OpenStreetMap map, say so and I'll wire that in.