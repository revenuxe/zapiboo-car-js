# Bangalore Household & Mixed-Scrap Pickup — Plan

## The core problem
Homes don't sell like factories. A household has a few bags of newspaper, an old fan, some bottles and plastic — all mixed. They don't know material grades, can't weigh it, and just want someone to come, pay fairly, and leave. The current booking flow asks them to pick exact materials, which is friction for this audience.

This plan reworks the experience for **Bangalore households selling mixed / small scrap**, keeping it dead-simple and mobile-first (most will book on a phone).

## Guiding UX principles
- No sorting required — "Mixed scrap" is the default, recommended path.
- No weighing required — ask for rough **size** (bags / boxes), not kilograms.
- Speak in ₹ (INR) and Indian household terms (raddi/newspaper, cardboard, bottles, e-waste, appliances).
- Bangalore-aware — locality + pincode picker with a "we cover your area" check.
- Big tap targets, few steps, instant confirmation.

## New booking flow (rebuilt /pickup)
A friendly 3-step wizard with a progress bar, optimized for thumbs:

```text
Step 1  What are you clearing?
        [ Mixed household scrap ]  <- big card, recommended
        [ Pick specific items ]   <- optional chips (raddi, metal, plastic, e-waste, appliances)
        Rough amount:  ( ) 1-2 bags   ( ) 3-5 bags   ( ) A lot / room clear-out
        + optional photo upload ("snap it, we'll handle the rest")

Step 2  Where in Bangalore?
        Locality dropdown (Koramangala, Indiranagar, Whitefield, HSR, ...)
        Pincode -> instant "We pick up here" / "Joining soon, notify me"
        Flat / house address + landmark

Step 3  When + who?
        Date  +  slot (Today / Tomorrow / pick a day)
        Name + phone (WhatsApp confirm)
        -> Confirmation screen with what to expect
```

### Handling "small scrap" gracefully
- Any quantity is accepted in covered localities; for very small loads we show a friendly note: *"Small load? We'll combine your area's pickups so it's still worth the trip — usually same or next day."*
- A soft minimum (e.g. ~₹ value or ~3 kg) is communicated as guidance, never a hard block, so nobody feels turned away.

## Bangalore localization
- Home + pickup copy tuned to Bangalore ("Doorstep scrap pickup across Bengaluru").
- A "Serving Bengaluru" badge and a covered-localities strip.
- Materials & Prices page switched to **₹ per kg** with household-relevant items:
  newspaper/raddi, cardboard, mixed plastic, glass bottles, old iron/steel, aluminium, copper, e-waste, old appliances.
- Add a household-focused "what we take from homes" section with simple icons.

## Pages & changes
1. **/pickup** — rebuilt 3-step wizard: mixed-scrap-first, size-not-weight, photo upload, Bangalore locality + pincode check, instant confirmation. Mobile-first layout.
2. **/materials** — INR rates + a dedicated "From your home" household items group; keep industrial grades below for business sellers.
3. **/** (home) — Bangalore framing in hero/sections, "Serving Bengaluru" badge, household-friendly messaging alongside the existing business angle.
4. **New data** — Bangalore localities + serviceable pincodes, household material rates in ₹, size-tier model.
5. (Optional next step) **/areas** — a simple "Where we pick up in Bengaluru" page, good for local SEO.

## Technical notes
- Add `src/lib/bangalore-data.ts`: localities, serviceable pincodes, household rates (₹), and size tiers (replaces raw weight).
- Pickup form state extends to: scrap type (mixed | specific[]), size tier, optional photo (preview only for now), locality, pincode, address, date, slot, name, phone.
- Pincode check is a simple client-side lookup against the serviceable list (no backend needed yet).
- Photo upload is preview-only on the client for now (no storage until backend is added).
- All within frontend/presentation — no schema or business-logic backend in this pass.

## One decision for you
Right now bookings show a success toast but aren't saved anywhere. Two options:
- **A — Keep it frontend-only now** (fastest; great for demo and getting the UX right).
- **B — Add Lovable Cloud** so every booking is actually stored, with photo uploads and a simple admin/ops view to manage Bangalore pickups.

I'll build the full Bangalore household experience either way — just tell me A or B for whether to persist bookings, and I'll proceed.
