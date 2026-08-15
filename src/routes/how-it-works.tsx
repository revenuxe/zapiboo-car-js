import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Truck, Wallet, PackageCheck, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Doorstep Scrap Pickup | HuluMart" },
      {
        name: "description",
        content:
          "From booking to instant payment in four simple steps. See how HuluMart's certified doorstep scrap pickup works.",
      },
      { property: "og:title", content: "How It Works — Doorstep Scrap Pickup | HuluMart" },
      {
        property: "og:description",
        content: "Book, prep, get weighed, and get paid. The HuluMart pickup process explained.",
      },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorks,
});

const flow = [
  {
    icon: CalendarClock,
    title: "1 · Book your slot",
    text: "Choose the materials you're selling, your address, and a convenient time. Booking takes under a minute and there's no obligation.",
  },
  {
    icon: PackageCheck,
    title: "2 · Prep your scrap",
    text: "Gather your items in any container. No need to sort or clean — our agents separate and grade everything on site.",
  },
  {
    icon: Truck,
    title: "3 · We arrive & weigh",
    text: "A vetted HuluMart agent arrives on schedule and weighs each material on certified, tamper-proof digital scales in front of you.",
  },
  {
    icon: BadgeDollarSign,
    title: "4 · Get paid instantly",
    text: "Review the live quote, approve, and receive payment to your wallet or bank account the moment we load up. Done.",
  },
];

const faqs = [
  {
    q: "Is there a minimum quantity?",
    a: "For households there's no strict minimum, but we recommend at least one full box so the trip is worthwhile. Business volumes get dedicated routes.",
  },
  {
    q: "How are prices set?",
    a: "Rates are kept transparent for common Bangalore household scrap categories. You see the per-kilogram price before you approve a pickup.",
  },
  {
    q: "What areas do you cover?",
    a: "HuluMart serves major Bangalore areas including Whitefield, HSR Layout, Koramangala, Indiranagar, JP Nagar, Hebbal and more.",
  },
  {
    q: "How do I get paid?",
    a: "Choose instant transfer to your HuluMart wallet, a linked bank account, or popular mobile money — the moment the agent loads your scrap.",
  },
];

function HowItWorks() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={<>Clutter to cash in <span className="text-gradient">four steps</span></>}
        subtitle="No middlemen, no haggling, no trips to the scrapyard. Here's exactly what happens when you book with HuluMart."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Book a pickup
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {flow.map((s, i) => (
              <Reveal key={s.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                    <s.icon className="size-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked</h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-bold text-foreground">{f.q}</h3>
                  <p className="mt-2 text-muted-foreground">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/pickup">
                Get started
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
