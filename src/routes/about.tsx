import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Globe2, HeartHandshake, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { stats } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HuluMart | Doorstep Scrap Collection in Bangalore" },
      {
        name: "description",
        content:
          "HuluMart provides doorstep scrap collection in Bangalore with transparent rates, certified weighing and instant payment.",
      },
      { property: "og:title", content: "About HuluMart | Doorstep Scrap Collection in Bangalore" },
      {
        property: "og:description",
        content: "Our mission: make scrap selling in Bangalore transparent, convenient and rewarding.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Transparency first", text: "Every weight, rate and payout is visible and verifiable." },
  { icon: Leaf, title: "Circular by design", text: "We divert recoverable materials from landfill and back into responsible recycling." },
  { icon: Globe2, title: "Bangalore coverage", text: "A local pickup network powered by verified agents who show up at your doorstep." },
  { icon: HeartHandshake, title: "Fair to everyone", text: "Homes, apartments and businesses get honest pricing and simple settlements." },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={<>Making Bangalore scrap selling <span className="text-gradient">simple</span></>}
        subtitle="HuluMart connects homes, apartments and businesses with verified scrap collection, transparent rates and responsible recycling."
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">Our story</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Scrap has always been valuable, but for most people selling it has been
                inconvenient. Prices were unclear, scales were doubted, and scheduling was messy.
              </p>
              <p>
                HuluMart was built to change that for Bangalore. We bring certified weighing,
                clear scrap rates, and doorstep collection into one simple booking flow.
              </p>
              <p>
                Today HuluMart focuses on reliable doorstep scrap collection across Bangalore,
                routing recovered material to responsible recycling partners and keeping it out
                of landfill.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-navy py-20 text-navy-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <div className="text-4xl font-extrabold text-gradient md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-navy-foreground/70">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-background py-24">
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
