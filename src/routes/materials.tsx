import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Cpu,
  Info,
  Newspaper,
  Plug,
  Recycle,
  Refrigerator,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { householdRates } from "@/lib/bangalore-data";

type PricingCategory = {
  title: string;
  icon: LucideIcon;
  items: Array<{ name: string; price: string }>;
};

const pricingCategories: PricingCategory[] = [
  {
    title: "Metals",
    icon: Wrench,
    items: [
      { name: "Iron / Steel", price: "₹ 20 - ₹30 / kg" },
      { name: "Copper (Heavy)", price: "₹ 600 - ₹800 / kg" },
      { name: "Copper Wire", price: "₹ 200 - ₹300 / kg" },
      { name: "Aluminium", price: "₹ 100 - ₹160 / kg" },
      { name: "Brass", price: "₹ 400 - ₹500 / kg" },
      { name: "Stainless Steel", price: "₹ 40 - ₹50 / kg" },
    ],
  },
  {
    title: "E-Waste",
    icon: Cpu,
    items: [
      { name: "Monitor", price: "₹ 100 / piece" },
      { name: "CPU", price: "₹ 200 - ₹300 / piece" },
      { name: "Laptop", price: "₹ 200 - ₹300 / piece" },
      { name: "Mobile / Tablet", price: "₹ 50 - ₹100 / piece" },
      { name: "Printer", price: "₹ 6 - ₹10 / kg" },
      { name: "Mixed Circuit Boards", price: "₹ 150 - ₹300 / kg" },
      { name: "Cables & Wires", price: "₹ 30 - ₹40 / kg" },
    ],
  },
  {
    title: "Paper",
    icon: Newspaper,
    items: [
      { name: "Newspaper", price: "₹ 10 - ₹15 / kg" },
      { name: "Office / White Paper", price: "₹ 10 - ₹12 / kg" },
      { name: "Books & Magazines", price: "₹ 10 - ₹14 / kg" },
      { name: "Waste Paper", price: "₹ 2 - ₹3 / kg" },
    ],
  },
  {
    title: "Plastics",
    icon: Recycle,
    items: [
      { name: "Hard Plastic", price: "₹ 5 - ₹10 / kg" },
      { name: "Mixed Plastic", price: "₹ 3 - ₹5 / kg" },
    ],
  },
  {
    title: "Appliances",
    icon: Refrigerator,
    items: [
      { name: "Refrigerator (Single Door)", price: "₹ 300 - ₹500 / piece" },
      { name: "Refrigerator (Double Door)", price: "₹ 600 - ₹800 / piece" },
      { name: "Washing Machine (Top Load)", price: "₹ 300 - ₹500 / piece" },
      { name: "Washing Machine (Front Load)", price: "₹ 600 - ₹800 / piece" },
      { name: "Air Conditioner", price: "₹ 1,500 - ₹2,000 / piece" },
      { name: "Microwave", price: "₹ 20 - ₹25 / kg" },
      { name: "TV (CRT / LCD / LED)", price: "₹ 100 - ₹500 / piece" },
    ],
  },
  {
    title: "Batteries & Others",
    icon: BatteryCharging,
    items: [
      { name: "Battery", price: "₹ 40 - ₹50 / kg" },
      { name: "UPS", price: "₹ 30 - ₹40 / kg" },
      { name: "Bike Scrap (Body)", price: "₹ Quote on inspection" },
      { name: "Car Scrap (Body)", price: "₹ Quote on inspection" },
    ],
  },
];

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
        content:
          "Fair, transparent ₹ rates for household scrap in Bengaluru with free doorstep pickup.",
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
  return (
    <>
      <PageHeader
        eyebrow="Rates · Bengaluru"
        title={
          <>
            What your scrap is <span className="text-gradient">worth today</span>
          </>
        }
        subtitle="Fair, transparent rates in ₹ per kg — the same price for every home, no haggling at the door."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Book a free pickup
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-2xl border border-primary/20 bg-accent/70 p-5 shadow-soft sm:flex sm:items-center sm:gap-4">
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:mb-0">
                <Info className="size-5" />
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground sm:text-base">
                Prices are indicative per kg in INR and may vary by market conditions and quality.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {pricingCategories.map((category, index) => (
              <Reveal key={category.title} delay={(index % 2) * 0.06}>
                <article className="h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                  <div className="flex items-center justify-between gap-4 border-b border-border bg-accent/35 p-5 sm:p-7">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green">
                        <category.icon className="size-7" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                          Category {String(index + 1).padStart(2, "0")}
                        </div>
                        <h2 className="mt-1 text-2xl font-bold leading-tight">{category.title}</h2>
                      </div>
                    </div>
                    <div className="hidden shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary sm:inline-flex">
                      <Plug className="size-4" />
                      {category.items.length} items
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="grid min-h-16 grid-cols-[minmax(0,1fr)] gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-7"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary/55" />
                          <span className="min-w-0 text-base font-medium leading-snug break-words">
                            {item.name}
                          </span>
                        </div>
                        <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-sm font-extrabold text-primary sm:justify-self-end sm:text-base">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
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
