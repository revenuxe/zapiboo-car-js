import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { steps, features, testimonials, materials } from "@/lib/site-data";

import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  featuredServiceAreas,
  organizationSchema,
  serviceAreas,
  serviceSchema,
  websiteSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-vehicles.webp";
import pickupImg from "@/assets/doorstep-inspection.webp";
import bikeImg from "@/assets/vehicle-bike.webp";
import carImg from "@/assets/vehicle-car.webp";
import commercialImg from "@/assets/vehicle-commercial.webp";
import electricImg from "@/assets/vehicle-electric.webp";
import scooterImg from "@/assets/vehicle-scooter.webp";
import suvImg from "@/assets/vehicle-suv.webp";

const homepageTitle = "Sell & Buy Used Cars, Bikes & Scooters in Bangalore | ZAPIBOO";
const homepageDescription =
  "Sell your used car, bike or scooter in Bangalore at the best price. Free doorstep inspection, instant payment, free RC transfer — and verified second-hand vehicles to buy.";

const vehicleSelectionCards = [
  {
    title: "Sell your car",
    text: "Hatchback, sedan or SUV — petrol, diesel, CNG.",
    image: carImg,
    search: { mode: "mixed" as const },
  },
  {
    title: "Sell your bike",
    text: "Commuter, sports and cruiser motorcycles.",
    image: bikeImg,
    search: { mode: "specific" as const, item: "Commuter (100–125cc)" },
  },
  {
    title: "Sell your scooter",
    text: "Activa, Access, Jupiter and city scooters.",
    image: scooterImg,
    search: { mode: "specific" as const, item: "110cc scooter" },
  },
  {
    title: "Sell an SUV",
    text: "Compact SUVs, MUVs and 7-seaters.",
    image: suvImg,
    search: { mode: "specific" as const, item: "SUV / MUV" },
  },
  {
    title: "Electric vehicles",
    text: "EV cars and electric two-wheelers.",
    image: electricImg,
    search: { mode: "specific" as const, item: "Electric car" },
  },
  {
    title: "Commercial vehicles",
    text: "Autos, mini trucks, tempos and fleet cars.",
    image: commercialImg,
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

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Used cars, bikes and scooters ready for resale in Bangalore"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-navy/60" />
          <div className="absolute -left-32 top-1/3 size-96 rounded-full bg-primary/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-navy-foreground/80"
              >
                <ShieldCheck className="size-3.5" />
                Bangalore's doorstep vehicle buyers
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
              >
                Sell your used <span className="text-primary">car</span>,{" "}
                <span className="text-primary">bike</span> or{" "}
                <span className="text-primary">scooter</span> in Bangalore
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg"
              >
                A market-linked offer in minutes, a free 140-point doorstep inspection, same-day bank
                transfer and free RC transfer — all without a single showroom visit.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
                  <Link to="/pickup">
                    Get free valuation
                    <ArrowRight />
                  </Link>
                </Button>
                <a
                  href={`https://wa.me/91${businessContact.phone}?text=${encodeURIComponent("Hi ZAPIBOO, I want a free valuation for my used vehicle in Bangalore.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00C875] px-5 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#00b36a] sm:w-auto"
                >
                  <WhatsAppIcon className="size-5" />
                  Sell on WhatsApp
                </a>
              </motion.div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-foreground/70">
                {["No listing fees", "Free RC transfer & NOC", "Payment before pickup"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8"
            >
              <h2 className="text-lg font-bold">What your vehicle could fetch today</h2>
              <p className="mt-1 text-sm text-navy-foreground/70">
                Indicative Bangalore resale bands — final offer after inspection.
              </p>
              <div className="mt-6 space-y-3">
                {materials.slice(0, 4).map((m) => (
                  <div
                    key={m.slug}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-navy/40 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-semibold">{m.name}</div>
                      <div className="text-xs text-navy-foreground/60">{m.trend}</div>
                    </div>
                    <div className="whitespace-nowrap text-right">
                      <span className="text-lg font-extrabold text-primary">{m.price}</span>
                      <span className="ml-1 text-xs text-navy-foreground/60">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outlineLight" size="lg" className="mt-6 w-full">
                <Link to="/materials">
                  See the full price guide
                  <ArrowRight />
                </Link>
              </Button>
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
                  className="group relative flex h-full min-h-40 flex-col justify-end overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 text-foreground shadow-soft transition-all hover:-translate-y-1 hover:bg-primary/10 hover:shadow-elevated sm:p-5"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent"
                  />
                  <img
                    src={card.image}
                    alt=""
                    width={1536}
                    height={1024}
                    className="pointer-events-none absolute inset-x-4 top-3 h-22 w-[calc(100%-2rem)] object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24"
                  />
                  <span className="relative text-center text-sm font-bold leading-tight sm:text-base">{card.title}</span>
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
                <div className="group h-full rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-soft sm:p-6">
                  <h3 className="whitespace-nowrap text-sm font-bold leading-tight sm:text-base">{m.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-gradient sm:text-2xl">{m.price}</span>
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground sm:text-sm">{m.unit}</span>
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
                to="/pickup"
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
              <Link to="/pickup">
                Check pickup availability
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
