import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Star,
  TrendingUp,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { steps, features, stats, testimonials } from "@/lib/site-data";
import { householdRates, serviceLocalities } from "@/lib/bangalore-data";
import heroImg from "@/assets/hero-scrap.jpg";
import pickupImg from "@/assets/doorstep-pickup.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HuluMart — Sell Scrap with Live Prices & Doorstep Pickup" },
      {
        name: "description",
        content:
          "Book doorstep scrap pickup in 60 seconds. Certified weighing, transparent live commodity prices, and instant payment. HuluMart powers global scrap commerce.",
      },
      { property: "og:title", content: "HuluMart — Sell Scrap with Live Prices & Doorstep Pickup" },
      {
        property: "og:description",
        content:
          "Transparent live pricing, certified weighing, and doorstep scrap pickup. Get paid instantly.",
      },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Sorted bales of recyclable scrap metal at a HuluMart yard"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-navy/40" />

        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-4 py-1.5 text-sm font-medium text-brand-green backdrop-blur"
            >
              <span className="size-2 rounded-full bg-brand-green" />
              Live prices · 42 countries · zero landfill
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl"
            >
              Turn your scrap into{" "}
              <span className="text-gradient">instant cash.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-navy-foreground/75"
            >
              Book a doorstep pickup in 60 seconds. We weigh on certified scales at live
              market rates and pay you the moment we load up. No middlemen, no haggling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
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
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-foreground/70"
            >
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand-green text-brand-green" /> 4.9/5 from 12,000+ pickups
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-green" /> Certified digital weighing
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="px-4 text-center">
              <div className="text-3xl font-extrabold text-foreground md:text-4xl">
                <span className="text-gradient">{s.value}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
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
              Three steps from clutter to cash — no gatekeepers in between.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="group relative h-full rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                    <step.icon className="size-7" />
                  </div>
                  <div className="mt-6 text-sm font-semibold text-primary">
                    Step {i + 1}
                  </div>
                  <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DOORSTEP PICKUP FEATURE */}
      <section className="bg-secondary/50 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl shadow-elevated">
              <img
                src={pickupImg}
                alt="A HuluMart agent weighing scrap at a customer's doorstep"
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
              We bring the scrapyard to your front door
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether it's a single box of cables or a warehouse of off-cuts, a vetted agent
              comes to you. Watch the live weight, see the live rate, and approve your payout
              right there.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Same-week slots, including weekends",
                "Live weighing on tamper-proof scales",
                "Instant payment to wallet or bank",
                "Digital receipt and carbon-saved report",
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

      {/* MATERIALS / PRICES */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Live prices
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Today's scrap rates, indexed to the market
              </h2>
              <p className="mt-4 text-muted-foreground">
                Prices update daily against global commodity benchmarks. What you see is what
                you get.
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/materials">
                View all materials
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {materials.slice(0, 8).map((m, i) => (
              <Reveal key={m.slug} delay={(i % 4) * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{m.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      <TrendingUp className="size-3" />
                      {m.trend}
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-foreground">{m.price}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{m.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY HULUMART */}
      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why HuluMart
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              A trustworthy backbone for scrap commerce
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

      {/* TESTIMONIALS */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by sellers worldwide</h2>
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

      {/* CTA */}
      <section className="bg-background pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-navy px-8 py-16 text-center text-navy-foreground shadow-elevated md:px-16 md:py-20">
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                  Ready to clear the clutter and{" "}
                  <span className="text-gradient">get paid?</span>
                </h2>
                <p className="mt-5 text-lg text-navy-foreground/75">
                  Join thousands turning scrap into cash with HuluMart's doorstep pickup.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild variant="hero" size="xl">
                    <Link to="/pickup">
                      Book your first pickup
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outlineLight" size="xl">
                    <Link to="/business">Sell at scale</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
