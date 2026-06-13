import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ExternalLink,
  Globe2,
  HeartHandshake,
  Leaf,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HuluMart | Doorstep Scrap Collection in Bangalore" },
      {
        name: "description",
        content:
          "Learn about HuluMart, a scrap collection platform built on scrap market roots from the 1980s and brought online in 2025 by Revenuxe.",
      },
      { property: "og:title", content: "About HuluMart | Doorstep Scrap Collection in Bangalore" },
      {
        property: "og:description",
        content:
          "HuluMart combines decades of scrap market experience with a modern online booking platform for Bangalore homes and businesses.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  {
    icon: Target,
    title: "Transparent by habit",
    text: "Clear material categories, visible rates and verified weighing keep every scrap deal understandable.",
  },
  {
    icon: Leaf,
    title: "Circular by design",
    text: "We route recoverable materials toward responsible recycling instead of letting value disappear into landfill.",
  },
  {
    icon: Globe2,
    title: "Local market knowledge",
    text: "Our work is shaped by real scrap-market experience, buyer networks and Bangalore collection realities.",
  },
  {
    icon: HeartHandshake,
    title: "Fair to everyone",
    text: "Homes, apartments, scrap shops and businesses get practical service, honest communication and simple settlements.",
  },
];

const timeline = [
  {
    year: "1980s",
    title: "Roots in the scrap market",
    text: "Our understanding of scrap started in the local market: materials, grades, weighing, reuse value, buyer demand and the trust needed to make every transaction work.",
  },
  {
    year: "2025",
    title: "HuluMart goes online",
    text: "We brought that market experience into an online booking platform so households and businesses can request scrap pickup with clearer rates and smoother coordination.",
  },
  {
    year: "Today",
    title: "Doorstep service with stronger systems",
    text: "HuluMart now connects customers, pickup agents, scrap shops and recycling partners through a simpler digital workflow.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={
          <>
            Scrap market experience, now <span className="text-gradient">online</span>
          </>
        }
        subtitle="HuluMart is built on roots in the scrap market from the 1980s and brought online in 2025 to make scrap pickup clearer, faster and more reliable."
      />

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <div className="space-y-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <CalendarClock className="size-7" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">Our story</h2>
              <p>
                Scrap has always carried value, but selling it has not always felt simple. For
                decades, the market depended on experience: knowing the material, understanding the
                grade, weighing it correctly and finding the right buyer.
              </p>
              <p>
                HuluMart was created to bring that ground-level knowledge into a modern doorstep
                experience. We combine old-market understanding with digital booking, transparent
                coordination and responsible recycling pathways.
              </p>
              <p>
                From homes and apartments to small scrap shops and corporate clearances, our goal is
                to make scrap movement more organized, more trustworthy and easier for every seller.
              </p>
            </div>
          </Reveal>

          <div className="space-y-5">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.08}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-bold text-primary">
                    {item.year}
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What we stand for</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <div className="flex h-full gap-5 rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                    <v.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{v.title}</h3>
                    <p className="mt-2 text-muted-foreground">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                  <BadgeCheck className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Product by Revenuxe
                  </p>
                  <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                    Built by Revenuxe for a cleaner scrap economy
                  </h2>
                </div>
                <p className="max-w-3xl text-muted-foreground">
                  HuluMart is a Revenuxe product designed to bring local scrap experience, practical
                  technology and reliable operations together for customers and business sellers.
                </p>
              </div>
              <Button asChild variant="outline" size="lg">
                <a href="https://www.revenuxe.com" target="_blank" rel="noreferrer">
                  Visit Revenuxe
                  <ExternalLink />
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to sell scrap from your doorstep?</h2>
          <p className="mt-4 text-muted-foreground">
            Book a pickup and get transparent rates, certified weighing and instant payment.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-8">
            <Link to="/pickup">
              Book a pickup
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
