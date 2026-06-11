import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Info, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { householdRates } from "@/lib/bangalore-data";
import { useScrapRates, formatPrice } from "@/lib/scrap-rates";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Scrap Rates in Bengaluru (₹ per kg) | HuluMart" },
      {
        name: "description",
        content:
          "Today's household scrap rates in Bengaluru — newspaper/raddi, plastic, metal, e-waste and more, priced fairly in ₹ per kg. Free doorstep pickup.",
      },
      { property: "og:title", content: "Scrap Rates in Bengaluru (₹ per kg) | HuluMart" },
      {
        property: "og:description",
        content: "Fair, transparent ₹ rates for household scrap in Bengaluru with free doorstep pickup.",
      },
    ],
    links: [{ rel: "canonical", href: "/materials" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "HuluMart Bengaluru household scrap rates",
          itemListElement: householdRates.map((m, i) => ({
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
  const { data: rates = [] } = useScrapRates();
  return (
    <>
      <PageHeader
        eyebrow="Rates · Bengaluru"
        title={<>What your scrap is <span className="text-gradient">worth today</span></>}
        subtitle="Fair, transparent rates in ₹ per kg — the same price for every home, no haggling at the door."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Book a free pickup
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <IndianRupee className="size-4" />
              From your home
            </div>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Household rates</h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {rates.map((m, i) => (
              <Reveal key={m.id} delay={(i % 4) * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
                  <h3 className="font-bold leading-tight">{m.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gradient">{formatPrice(m.price)}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                  </div>
                  {m.note && <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-6 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                Rates are updated regularly against market prices. Your final ₹ rate is confirmed
                live on a certified scale at pickup and always shown before you accept payment.
                Mixed scrap is sorted and priced by our agent on the spot.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bulk / business */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">Selling in bulk or from a shop?</h2>
            <p className="mt-4 text-muted-foreground">
              Apartments, offices, workshops and stores get scheduled routes, volume pricing and
              consolidated payouts. Tell us what you have and we'll quote it.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/business">See business plans</Link>
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
