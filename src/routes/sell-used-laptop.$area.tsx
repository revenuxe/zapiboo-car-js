import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Laptop,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SellLocationHero } from "@/components/sell/SellLocationHero";
import { LaptopBrandsSection } from "@/components/sell/LaptopBrandsSection";
import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  faqSchema,
  getAreaBySlug,
  organizationSchema,
} from "@/lib/seo";

const laptopBrands = [
  { name: "Apple MacBook", slug: "apple" },
  { name: "Dell", slug: "dell" },
  { name: "HP", slug: "hp" },
  { name: "Lenovo", slug: "lenovo" },
  { name: "Asus", slug: "asus" },
  { name: "Acer", slug: "acer" },
  { name: "MSI", slug: "msi" },
];

export const Route = createFileRoute("/sell-used-laptop/$area")({
  loader: ({ params, context }) => {
    const area = getAreaBySlug(params.area);
    if (!area) throw notFound();
    // Prefetch laptop brands so the brand grid renders instantly.
    context.queryClient.prefetchQuery(categoryWithBrandsQuery("laptops"));
    return { area };
  },
  head: ({ params }) => {
    const area = getAreaBySlug(params.area);
    if (!area) return {};
    const path = `/sell-used-laptop/${area.slug}`;
    const title = `Sell Used Laptop in ${area.name}, Bangalore - Instant Cash | HuluMart`;
    const description = `Sell your old or used laptop in ${area.name}, Bangalore for instant cash. Free instant quote, free doorstep pickup and same-day UPI payment for Apple, Dell, HP, Lenovo, Asus & more.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `sell used laptop ${area.name}, sell old laptop ${area.name} Bangalore, laptop buyer ${area.name}, second hand laptop price ${area.name}, sell laptop for cash ${area.name}`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:type", content: "website" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            organizationSchema(path),
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": `${absoluteUrl(path)}#service`,
              name: `Sell Used Laptop in ${area.name}, Bangalore`,
              serviceType: "Used laptop buyback with free doorstep pickup",
              provider: { "@id": `${absoluteUrl("/")}#organization` },
              areaServed: { "@type": "Place", name: `${area.name}, Bangalore` },
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Sell Laptop", path: "/sell/laptops" },
              { name: `Sell Used Laptop in ${area.name}`, path },
            ]),
            faqSchema([
              {
                question: `How can I sell my used laptop in ${area.name}, Bangalore?`,
                answer: `Get a free instant quote online, book a free doorstep pickup in ${area.name}, and our verified agent collects your laptop and pays you instantly via UPI or bank transfer.`,
              },
              {
                question: `Which laptop brands do you buy in ${area.name}?`,
                answer: `We buy all major brands in ${area.name} including Apple MacBook, Dell, HP, Lenovo, Asus, Acer and MSI - working or with minor issues.`,
              },
              {
                question: `Is laptop pickup free in ${area.name}?`,
                answer: `Yes. Doorstep pickup is completely free across ${area.name} and nearby localities. You only need to be present to hand over the device.`,
              },
              {
                question: `When do I get paid after selling my laptop?`,
                answer: `Payment is instant. Once our agent verifies your laptop at your ${area.name} address, the money is transferred on the spot.`,
              },
            ]),
          ]),
        },
      ],
    };
  },
  component: SellLaptopArea,
});

function SellLaptopArea() {
  const { area } = Route.useLoaderData();
  const whatsappHref = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(
    `Hi HuluMart, I want to sell my used laptop in ${area.name}, Bangalore. Please help me with a quote.`,
  )}`;

  return (
    <>
      <SellLocationHero
        heading={
          <>
            Sell your old <span className="text-gradient">laptop</span> in {area.name}
          </>
        }
        subtitle={`Get the best price for your used laptop in ${area.name}, Bangalore. Free doorstep pickup and instant payment the moment we collect it.`}
        defaultPincode={area.pincode ?? ""}
        whatsappMessage={`Hi HuluMart, I want to sell my used laptop in ${area.name}, Bangalore. Please help me with a quote.`}
      />

      <LaptopBrandsSection
        heading={`Sell any laptop brand in ${area.name}`}
        subtitle={`Instant quote for Apple, Dell, HP, Lenovo, Asus, Acer & MSI — free doorstep pickup across ${area.name}.`}
      />

      {/* INTRO CONTENT + WHY US */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Best laptop buyer in {area.name}
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Get the best price for your laptop in {area.name}
            </h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Looking to <strong>sell your old laptop in {area.name}</strong>? HuluMart is the
                trusted local laptop buyer for {area.name} and nearby areas. Whether your laptop is
                a few months old or a few years old, working perfectly or has a cracked screen,
                battery or keyboard issues - we make you a fair, transparent offer based on the
                current Bangalore resale market.
              </p>
              <p>
                We buy <strong>second hand laptops of every brand in {area.name}</strong> - Apple
                MacBook Air and MacBook Pro, Dell XPS, Inspiron and Latitude, HP Pavilion, Envy and
                EliteBook, Lenovo ThinkPad, IdeaPad and Legion, plus Asus, Acer and MSI gaming
                laptops. No haggling, no lowball offers - just an honest price and instant payment
                at your doorstep.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground">Sell your laptop brand:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {laptopBrands.map((b) => (
                  <Link
                    key={b.slug}
                    to="/sell-old-laptop/$brand"
                    params={{ brand: b.slug }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
                  >
                    <Laptop className="size-4 text-primary" />
                    Sell {b.name} laptop
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">Why sell your laptop in {area.name} with HuluMart?</h2>
              <ul className="mt-5 space-y-4">
                {[
                  "Best market price benchmarked for Bangalore resale",
                  `Free doorstep pickup across ${area.name}`,
                  "Free instant quote in under 2 minutes",
                  "Certified data wiping on every device",
                  "Instant UPI or bank payment after verification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {area.nearby.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold">We also cover nearby</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {area.nearby.map((nearby: string) => (
                      <span
                        key={nearby}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                      >
                        {nearby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                <Link to="/sell/$category" params={{ category: "laptops" }}>
                  Get my laptop price <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            How to sell your laptop in {area.name}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Three simple steps to instant cash for your used laptop in {area.name}.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BadgeIndianRupee,
                title: "Get an instant quote",
                text: "Select your laptop brand and model, answer a few condition questions and see your price instantly.",
              },
              {
                icon: Truck,
                title: `Free pickup in ${area.name}`,
                text: `Book a convenient slot. Our verified agent comes to your ${area.name} address and verifies the laptop.`,
              },
              {
                icon: Wallet,
                title: "Instant payment",
                text: "Once verified, get paid instantly via UPI or bank transfer - no waiting, no deductions.",
              },
            ].map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="absolute right-5 top-5 text-4xl font-black text-secondary">{i + 1}</span>
                <s.icon className="size-9 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeIndianRupee, title: "Best price", text: `Live valuation for the ${area.name} resale market.` },
              { icon: ShieldCheck, title: "Safe & data-wiped", text: "Certified data erasure on every laptop we collect." },
              { icon: Truck, title: "Free pickup", text: `Doorstep collection across ${area.name}.` },
              { icon: Wallet, title: "Instant payment", text: "Money in your account the moment we verify." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <f.icon className="size-7 text-primary" />
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Selling a laptop in {area.name} - FAQs
          </h2>
          <div className="mt-8 space-y-3">
            {[
              {
                q: `How can I sell my used laptop in ${area.name}?`,
                a: `Get a free instant quote online, book a free doorstep pickup in ${area.name}, and our verified agent collects your laptop and pays you instantly.`,
              },
              {
                q: `Which laptop brands do you buy in ${area.name}?`,
                a: `We buy all major brands in ${area.name} - Apple MacBook, Dell, HP, Lenovo, Asus, Acer and MSI - working or with minor issues.`,
              },
              {
                q: `Is the laptop pickup really free in ${area.name}?`,
                a: `Yes, doorstep pickup is completely free across ${area.name} and nearby localities.`,
              },
              {
                q: "When do I get paid?",
                a: `Instantly. Once our agent verifies your laptop at your ${area.name} address, payment is transferred on the spot via UPI or bank transfer.`,
              },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Ready to sell your laptop in {area.name}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Get your free instant quote now and book a same-day doorstep pickup in {area.name},
            Bangalore.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/sell/$category" params={{ category: "laptops" }}>
                Get instant quote <ArrowRight />
              </Link>
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-5" />
              Sell on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
