import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Globe2, HeartHandshake, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { stats } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HuluMart — Powering Global Scrap Commerce" },
      {
        name: "description",
        content:
          "HuluMart is building a transparent, traceable marketplace for the circular economy — connecting scrap sellers to the world's best recyclers.",
      },
      { property: "og:title", content: "About HuluMart — Powering Global Scrap Commerce" },
      {
        property: "og:description",
        content: "Our mission: make recycling rewarding and scrap commerce transparent at global scale.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Transparency first", text: "Every weight, rate and payout is visible and verifiable. No black boxes, no gate games." },
  { icon: Leaf, title: "Circular by design", text: "We divert materials from landfill and back into industry — with a carbon report for every load." },
  { icon: Globe2, title: "Global reach, local trust", text: "A worldwide buyer network powered by vetted agents who show up in your neighborhood." },
  { icon: HeartHandshake, title: "Fair to everyone", text: "Households and factories get the same honest pricing and the same instant settlements." },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={<>Making the world's scrap <span className="text-gradient">flow freely</span></>}
        subtitle="HuluMart connects the people who have scrap with the recyclers who need it — transparently, traceably, and at global scale."
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">Our story</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Scrap has always been valuable — but for most people, selling it has been
                opaque, inconvenient, and unfair. Prices were hidden, scales were doubted, and
                a chain of middlemen quietly skimmed the value.
              </p>
              <p>
                We built HuluMart to change that. By bringing certified weighing, live
                market pricing, and instant payment to your doorstep, we cut out the guesswork
                and the gatekeepers. What's left is simple: recycling that actually rewards you.
              </p>
              <p>
                Today HuluMart powers scrap commerce across 42 countries, routing every
                kilogram to the highest-paying verified recycler — and keeping it out of
                landfill for good.
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
          <Reveal className="mt-14 text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/pickup">
                Join the movement
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
