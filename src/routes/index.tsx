import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bike,
  Car,
  Caravan,
  CheckCircle2,
  MapPin,
  Quote,
  Truck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { steps, features, testimonials, materials } from "@/lib/site-data";

import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";
import {
  absoluteUrl,
  breadcrumbSchema,
  featuredServiceAreas,
  businessContact,
  organizationSchema,
  serviceAreas,
  serviceSchema,
  websiteSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-vehicles.webp";
import pickupImg from "@/assets/doorstep-inspection.webp";

const homepageTitle = "Sell & Buy Used Cars, Bikes & Scooters in Bangalore | ZAPIBOO";
const homepageDescription =
  "Sell your used car, bike or scooter in Bangalore at the best price. Free doorstep inspection, instant payment, free RC transfer — and verified second-hand vehicles to buy.";

const vehicleSelectionCards = [
  {
    title: "Sell your car",
    text: "Hatchback, sedan or SUV — petrol, diesel, CNG.",
    icon: Car,
    search: { mode: "mixed" as const },
  },
  {
    title: "Sell your bike",
    text: "Commuter, sports and cruiser motorcycles.",
    icon: Bike,
    search: { mode: "specific" as const, item: "Commuter (100–125cc)" },
  },
  {
    title: "Sell your scooter",
    text: "Activa, Access, Jupiter and city scooters.",
    icon: Caravan,
    search: { mode: "specific" as const, item: "110cc scooter" },
  },
  {
    title: "Sell an SUV",
    text: "Compact SUVs, MUVs and 7-seaters.",
    icon: Car,
    search: { mode: "specific" as const, item: "SUV / MUV" },
  },
  {
    title: "Electric vehicles",
    text: "EV cars and electric two-wheelers.",
    icon: Zap,
    search: { mode: "specific" as const, item: "Electric car" },
  },
  {
    title: "Commercial vehicles",
    text: "Autos, mini trucks, tempos and fleet cars.",
    icon: Truck,
    search: { mode: "specific" as const, item: "Mini truck / pickup" },
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: homepageTitle },
      { name: "description", content: homepageDescription },
      { property: "og:title", content: homepageTitle },
      { property: "og:description", content: homepageDescription },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:image", content: heroImg },
      { name: "twitter:title", content: homepageTitle },
      { name: "twitter:description", content: homepageDescription },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/"),
          websiteSchema(),
          serviceSchema("/"),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
        ]),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featuredAreas = serviceAreas.filter((area) => featuredServiceAreas.includes(area.slug));
  const { data: availability } = useServiceAvailability();
  const [heroPincode, setHeroPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const cleanHeroPincode = heroPincode.replace(/\D/g, "").slice(0, 6);
  const pincodeReady = cleanHeroPincode.length === 6;
  const pincodeAvailable = pincodeReady && isPincodeAvailable(cleanHeroPincode, availability);
  const pincodeUnavailable =
    pincodeChecked &&
    pincodeReady &&
    availability &&
    !isPincodeAvailable(cleanHeroPincode, availability);
  const pincodeIncomplete = pincodeChecked && !pincodeReady;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Used cars, bikes and scooters ready for resale in Bangalore"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-navy/45" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:px-8">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl"
            >
              Sell Your Used Car, Bike or Scooter in <span className="text-gradient">Bangalore</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg"
            >
              Get a fair, market-linked price for your second-hand car, bike or scooter with a
              free doorstep inspection anywhere in Bangalore. Instant payment, free RC transfer,
              and a curated stock of verified used vehicles if you are buying.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-7 max-w-2xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" size="xl">
                  <Link to="/pickup">
                    Get free valuation
                    <ArrowRight />
                  </Link>
                </Button>
                <form
                  className="flex min-w-0 flex-1 rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-elevated backdrop-blur"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setPincodeChecked(true);
                  }}
                >
                  <label className="flex min-w-0 flex-1 items-center gap-2 px-3 text-navy-foreground">
                    <MapPin className="size-4 shrink-0 text-primary" />
                    <span className="sr-only">Check pincode availability</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={cleanHeroPincode}
                      maxLength={6}
                      onChange={(event) => {
                        setHeroPincode(event.target.value);
                        setPincodeChecked(false);
                      }}
                      placeholder="Enter pincode"
                      className="h-11 min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-navy-foreground/55"
                    />
                  </label>
                  {pincodeChecked && pincodeAvailable ? (
                    <Button
                      asChild
                      variant="hero"
                      size="lg"
                      className="h-11 rounded-xl px-4 text-sm"
                    >
                      <Link to="/pickup" search={{ pincode: cleanHeroPincode }}>
                        Book
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="outlineLight"
                      size="lg"
                      className="h-11 rounded-xl px-4 text-sm"
                    >
                      Check
                    </Button>
                  )}
                </form>
              </div>
              <div className="mt-3 min-h-5 text-xs font-medium leading-relaxed sm:text-sm">
                {!pincodeChecked && (
                  <span className="text-navy-foreground/70">
                    Check if free doorstep inspection is available in your 6-digit pincode.
                  </span>
                )}
                {pincodeIncomplete && (
                  <span className="text-navy-foreground/75">
                    Enter a valid 6-digit Bangalore pincode.
                  </span>
                )}
                {pincodeChecked && pincodeAvailable && (
                  <span className="text-primary">
                    Doorstep inspection available in {cleanHeroPincode}. You can book now.
                  </span>
                )}
                {pincodeUnavailable && (
                  <span className="text-navy-foreground/75">
                    Not available in {cleanHeroPincode} yet. Call {businessContact.phone} for help.
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                What are you selling?
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Start with your vehicle</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Choose a category and the valuation flow opens with your vehicle type already selected.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {vehicleSelectionCards.map((card, index) => (
              <Reveal key={card.title} delay={(index % 3) * 0.05}>
                <Link
                  to="/pickup"
                  search={card.search}
                  className="group relative flex h-full min-h-36 flex-col overflow-hidden rounded-2xl border border-primary/20 bg-gradient-brand p-4 text-primary-foreground shadow-green transition-all hover:-translate-y-1 hover:brightness-105 hover:shadow-elevated sm:p-5"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-white/15 blur-2xl transition-transform group-hover:scale-125"
                  />
                  <span className="relative flex size-11 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-soft transition-transform group-hover:scale-105">
                    <card.icon className="size-5" />
                  </span>
                  <span className="relative mt-4 font-bold leading-tight">{card.title}</span>
                  <span className="relative mt-2 text-xs leading-relaxed text-primary-foreground/80">
                    {card.text}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 overflow-hidden px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-4 lg:px-8">
          {[
            { value: "60 min", label: "Free inspection" },
            { value: "40+", label: "Bangalore areas" },
            { value: "Free", label: "RC transfer" },
            { value: "4.9/5", label: "Seller rating" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="px-4 text-center">
              <div className="text-3xl font-extrabold text-foreground md:text-4xl">
                <span className="text-gradient">{s.value}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Selling your vehicle, finally made simple
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three steps from listing to payment, with no haggling and no hidden charges.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="group relative h-full rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                    <step.icon className="size-7" />
                  </div>
                  <div className="mt-6 text-sm font-semibold text-primary">Step {i + 1}</div>
                  <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl shadow-elevated">
              <img
                src={pickupImg}
                alt="ZAPIBOO evaluator inspecting a used car at a Bangalore home"
                width={1200}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Doorstep inspection
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              We buy your used vehicle right at your doorstep
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether it is a 12-year-old hatchback or a two-year-old scooter, a trained ZAPIBOO
              evaluator comes to you. See the inspection report, understand how the price was
              arrived at, and approve your payout on the spot.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Same-day and next-day inspection slots",
                "140-point inspection with a shared report",
                "Instant bank transfer once you accept",
                "Free RC transfer, NOC and insurance handover",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-9">
              <Link to="/pickup">
                Book my free inspection
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Bangalore resale price guide
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                What used vehicles sell for in Bangalore
              </h2>
              <p className="mt-4 text-muted-foreground">
                Indicative price bands by body type. Your final offer depends on year, kilometres, variant and condition.
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/materials">
                View full price guide
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {materials.map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-soft">
                  <h3 className="font-bold leading-tight">{m.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gradient">{m.price}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{m.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/25 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
              Service area
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Serving All Areas of <span className="text-primary">Bangalore</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Free doorstep vehicle inspection and pickup across every major Bangalore neighbourhood.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {featuredAreas.map((area) => (
              <Link
                key={area.slug}
                to="/areas/$area"
                params={{ area: area.slug }}
                className="group flex min-h-24 min-w-0 flex-col items-start gap-3 rounded-2xl border border-border bg-card px-3 py-4 text-left font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary sm:min-h-20 sm:flex-row sm:items-center sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-4" />
                </span>
                <span className="min-w-0 text-sm leading-tight break-words sm:text-base">
                  {area.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              From HBR Layout and Nagawara to Whitefield, HSR Layout, JP Nagar and beyond.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/areas">
                View all Bangalore areas
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why ZAPIBOO
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              A trusted used-vehicle partner in Bangalore
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Trusted by Bangalore buyers and sellers</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <Quote className="size-8 text-primary/30" />
                  <blockquote className="mt-4 flex-1 text-foreground">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 border-t border-border pt-5">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
