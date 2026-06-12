import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  MapPin,
  Package,
  Quote,
  Recycle,
  Star,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { steps, features, testimonials } from "@/lib/site-data";
import { householdRates } from "@/lib/bangalore-data";
import {
  absoluteUrl,
  breadcrumbSchema,
  featuredServiceAreas,
  organizationSchema,
  serviceAreas,
  serviceSchema,
  websiteSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-scrap.webp";
import pickupImg from "@/assets/doorstep-pickup.webp";

const homepageTitle = "Best Scrap Buyers in Bangalore | Doorstep Scrap Collection";
const homepageDescription =
  "HuluMart is one of the best scrap buyers in Bangalore for doorstep scrap collection, live scrap prices, certified weighing and instant payment across major Bangalore areas.";

const scrapSelectionCards = [
  {
    title: "Mixed scrap",
    text: "Raddi, plastic, bottles and metal together.",
    icon: Boxes,
    search: { mode: "mixed" as const },
  },
  {
    title: "Metal",
    text: "Iron, steel, aluminium, brass and copper.",
    icon: Wrench,
    search: { mode: "specific" as const, item: "Iron & Metal" },
  },
  {
    title: "Plastic",
    text: "PET bottles, mixed plastic and containers.",
    icon: Recycle,
    search: { mode: "specific" as const, item: "Plastic & Bottles" },
  },
  {
    title: "Paper / raddi",
    text: "Newspapers, books, cartons and cardboard.",
    icon: Package,
    search: { mode: "specific" as const, item: "Newspaper / Raddi" },
  },
  {
    title: "E-waste",
    text: "Small devices, wires, chargers and boards.",
    icon: Cpu,
    search: { mode: "specific" as const, item: "E-Waste" },
  },
  {
    title: "Other items",
    text: "Appliances, glass bottles and shop scrap.",
    icon: CheckCircle2,
    search: { mode: "specific" as const, item: "Old Appliances" },
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
            alt="Sorted recyclable scrap ready for professional pickup in Bangalore"
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
              Best Scrap Buyers in <span className="text-gradient">Bangalore</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg"
            >
              Doorstep scrap collection for newspaper, raddi, metal, plastic, e-waste and old
              appliances. Book a pickup, see transparent rates, and get paid after certified
              weighing at your door.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/pickup">
                  Book a pickup
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/materials">See today's prices</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-foreground/70"
            >
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand-green text-brand-green" /> 4.9/5 from 12,000+ pickups
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-green" /> Certified digital weighing
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-brand-green" /> Bangalore-wide pickup
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Select scrap to sell
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Start with what you have
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Choose a category and the booking flow opens with your scrap type already selected.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {scrapSelectionCards.map((card, index) => (
              <Reveal key={card.title} delay={(index % 3) * 0.05}>
                <Link
                  to="/pickup"
                  search={card.search}
                  className="group flex h-full min-h-36 flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevated sm:p-5"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <card.icon className="size-5" />
                  </span>
                  <span className="mt-4 font-bold leading-tight">{card.title}</span>
                  <span className="mt-2 text-xs leading-relaxed text-muted-foreground">
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
            { value: "30 min", label: "Avg. callback time" },
            { value: "40+", label: "Bangalore areas" },
            { value: "24 hr", label: "Pickup support" },
            { value: "4.9/5", label: "Pickup rating" },
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
              Selling scrap, finally made simple
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three steps from clutter to cash, with no haggling and no hidden charges.
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
                alt="HuluMart doorstep scrap pickup with certified weighing in Bangalore"
                width={1200}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Doorstep pickup
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              We bring trusted scrap buying to your front door
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether it is a single box of newspapers or a full home clean-out, a vetted
              HuluMart agent comes to you. Watch the live weight, see the live rate and approve
              your payout right there.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Same-day and next-day pickup slots",
                "Live weighing on certified digital scales",
                "Instant payment after pickup",
                "Digital receipt for your scrap sale",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-9">
              <Link to="/pickup">
                Schedule my pickup
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
                Bangalore scrap rates
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Fair rates for everyday household scrap
              </h2>
              <p className="mt-4 text-muted-foreground">
                The same honest price for every home, sorted and weighed at your door.
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/materials">
                View all rates
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {householdRates.slice(0, 8).map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-soft">
                  <h3 className="font-bold leading-tight">{m.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gradient">{m.price}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                  </div>
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
              Free doorstep scrap pickup across every major Bangalore neighbourhood.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {featuredAreas.map((area) => (
              <Link
                key={area.slug}
                to="/areas/$area"
                params={{ area: area.slug }}
                className="group flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-left font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-4" />
                </span>
                <span className="leading-tight">{area.name}</span>
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
              Why HuluMart
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              A reliable scrap buyer for Bangalore homes
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
            <h2 className="text-3xl font-bold sm:text-4xl">Trusted by Bangalore sellers</h2>
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
