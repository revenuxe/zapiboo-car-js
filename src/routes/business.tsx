import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Route as RouteIcon, FileText, Headset, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "For Business — Sell Scrap at Scale | HuluMart" },
      {
        name: "description",
        content:
          "Scheduled routes, consolidated payouts, and analytics dashboards for factories, fabricators and recyclers selling scrap in volume with HuluMart.",
      },
      { property: "og:title", content: "For Business — Sell Scrap at Scale | HuluMart" },
      {
        property: "og:description",
        content: "Dedicated pickup routes, volume pricing and dashboards for business scrap sellers.",
      },
    ],
    links: [{ rel: "canonical", href: "/business" }],
  }),
  component: Business,
});

const perks = [
  { icon: RouteIcon, title: "Scheduled routes", text: "Set recurring pickups that fit your production cycle — daily, weekly, or on demand." },
  { icon: BarChart3, title: "Volume analytics", text: "Track tonnage, revenue by material, and recovery trends from one live dashboard." },
  { icon: FileText, title: "Consolidated payouts", text: "One clean statement and a single payment across all your sites and materials." },
  { icon: Headset, title: "Dedicated account team", text: "A named manager, priority slots, and contract pricing for high-volume sellers." },
];

const tiers = [
  {
    name: "Workshop",
    desc: "For small fabricators & garages",
    points: ["Same-week pickups", "Live market pricing", "Digital receipts", "Wallet payouts"],
    cta: "Start selling",
  },
  {
    name: "Factory",
    desc: "For plants & mid-size recyclers",
    points: ["Scheduled routes", "Volume pricing tiers", "Analytics dashboard", "Net-7 settlements"],
    cta: "Talk to sales",
    featured: true,
  },
  {
    name: "Enterprise",
    desc: "For multi-site operations",
    points: ["Global route network", "Custom contract rates", "API & ERP integration", "Dedicated manager"],
    cta: "Request a quote",
  },
];

function Business() {
  return (
    <>
      <PageHeader
        eyebrow="For business"
        title={<>Scrap logistics that <span className="text-gradient">scale with you</span></>}
        subtitle="From a single workshop to a global plant network, HuluMart turns your waste streams into a reliable, transparent revenue line."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/contact">
            Talk to sales
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <p.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-muted-foreground">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Plans for every volume</h2>
            <p className="mt-4 text-muted-foreground">
              No platform fees to sell. You keep more of every kilogram.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  className={
                    "flex h-full flex-col rounded-2xl border p-8 " +
                    (t.featured
                      ? "border-primary bg-card shadow-elevated ring-1 ring-primary/30"
                      : "border-border bg-card shadow-soft")
                  }
                >
                  {t.featured && (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{t.name}</h3>
                  <p className="mt-1 text-muted-foreground">{t.desc}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {t.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="text-foreground">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={t.featured ? "hero" : "outline"}
                    size="lg"
                    className="mt-8"
                  >
                    <Link to="/contact">{t.cta}</Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
