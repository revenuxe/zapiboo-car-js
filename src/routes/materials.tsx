import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { materials } from "@/lib/site-data";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Materials & Live Scrap Prices | HuluMart" },
      {
        name: "description",
        content:
          "Live per-kilogram prices for copper, aluminium, brass, steel, e-waste and more. Indexed daily to global commodity markets.",
      },
      { property: "og:title", content: "Materials & Live Scrap Prices | HuluMart" },
      {
        property: "og:description",
        content: "Transparent, market-indexed scrap prices updated daily. See what your scrap is worth.",
      },
    ],
    links: [{ rel: "canonical", href: "/materials" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "HuluMart scrap materials and prices",
          itemListElement: materials.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.name,
          })),
        }),
      },
    ],
  }),
  component: Materials,
});

function Materials() {
  return (
    <>
      <PageHeader
        eyebrow="Materials & prices"
        title={<>What's your scrap <span className="text-gradient">worth today?</span></>}
        subtitle="Rates are indexed daily to global commodity benchmarks — fully transparent, never negotiated at the gate."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Sell these materials
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 3) * 0.06}>
                <div className="group h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{m.name}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                      <TrendingUp className="size-3" />
                      {m.trend}
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gradient">{m.price}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                  </div>
                  <p className="mt-3 text-muted-foreground">{m.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-6 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                Displayed prices are indicative benchmarks updated daily. Your final per-kilogram
                rate is confirmed live at pickup based on grade and current market conditions, and
                is always shown before you approve payment.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">Don't see your material?</h2>
            <p className="mt-4 text-muted-foreground">
              We trade dozens of grades beyond this list. Tell us what you have and we'll quote it.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/pickup">Book a pickup</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Ask about a material</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
