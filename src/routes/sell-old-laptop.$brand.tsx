import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Cpu,
  Laptop,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  faqSchema,
  featuredServiceAreas,
  organizationSchema,
  serviceAreas,
} from "@/lib/seo";
import { getLaptopBrandBySlug, laptopBrands } from "@/lib/laptop-brands";

export const Route = createFileRoute("/sell-old-laptop/$brand")({
  loader: ({ params }) => {
    const brand = getLaptopBrandBySlug(params.brand);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ params }) => {
    const brand = getLaptopBrandBySlug(params.brand);
    if (!brand) return {};
    const path = `/sell-old-laptop/${brand.slug}`;
    const title = `Sell Used ${brand.name} Laptop in Bangalore — Instant Cash | HuluMart`;
    const description = `Sell your old or used ${brand.name} laptop in Bangalore for instant cash. Free instant quote, free doorstep pickup and same-day UPI payment. ${brand.priceRange} for ${brand.popularSeries
      .map((s) => s.name)
      .slice(0, 3)
      .join(", ")} & more.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: brand.keywords.join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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
              name: `Sell Used ${brand.name} Laptop in Bangalore`,
              serviceType: `Used ${brand.name} laptop buyback with free doorstep pickup`,
              provider: { "@id": `${absoluteUrl("/")}#organization` },
              areaServed: { "@type": "Place", name: "Bangalore" },
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
                priceCurrency: "INR",
                url: absoluteUrl(path),
              },
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Sell Laptop", path: "/sell/laptops" },
              { name: `Sell ${brand.name} Laptop`, path },
            ]),
            faqSchema(brand.faqs.map((f) => ({ question: f.q, answer: f.a }))),
          ]),
        },
      ],
    };
  },
  component: SellBrandLaptop,
});

function SellBrandLaptop() {
  const { brand } = Route.useLoaderData();
  const otherBrands = laptopBrands.filter((b) => b.slug !== brand.slug);
  const areas = serviceAreas.filter((a) => featuredServiceAreas.includes(a.slug)).slice(0, 12);
  const whatsappHref = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(
    `Hi HuluMart, I want to sell my used ${brand.name} laptop in Bangalore. Please help me with a quote.`,
  )}`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-green/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-green">
            Sell {brand.name} laptop
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.08] sm:text-5xl">
            {brand.headline.replace(brand.name, "")}{" "}
            <span className="text-gradient">{brand.name}</span> Laptop in Bangalore
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
            {brand.tagline} Free instant quote, free doorstep pickup and same-day UPI payment across
            Bengaluru.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/sell/$category/$brand" params={{ category: "laptops", brand: brand.slug }}>
                Get instant {brand.name} quote
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <a href={businessContact.phoneHref}>
                <Phone className="size-4" /> Call {businessContact.phone}
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-foreground/70">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-brand-green text-brand-green" /> 4.9/5 seller rating
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeIndianRupee className="size-4 text-brand-green" /> {brand.priceRange}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-brand-green" /> Same-day pickup
            </span>
          </div>
        </div>
      </section>

      {/* INTRO CONTENT */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Best {brand.name} laptop buyer in Bangalore
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Get the best price for your {brand.name} laptop
            </h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {brand.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">Why sell your {brand.name} laptop with HuluMart?</h2>
              <ul className="mt-5 space-y-4">
                {[
                  `Best price for ${brand.name} laptops in the Bangalore resale market`,
                  "Free doorstep pickup across all of Bengaluru",
                  "Free instant quote in under 2 minutes",
                  "Certified data wiping on every laptop",
                  "Instant UPI or bank payment after verification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                <Link to="/sell/$category/$brand" params={{ category: "laptops", brand: brand.slug }}>
                  Get my {brand.name} price <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* POPULAR SERIES */}
      <section className="bg-secondary/40 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            {brand.name} series we buy in Bangalore
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            We buy every {brand.name} laptop series at the best resale price. Pick your series for an
            instant quote, free pickup and same-day payment.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {brand.popularSeries.map((s) => (
              <div
                key={s.name}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <Cpu className="mt-0.5 size-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-bold">Sell {s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-foreground">Popular {brand.name} models we buy:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {brand.models.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-soft"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <Button asChild variant="hero" size="lg" className="mt-8">
            <Link to="/sell/$category/$brand" params={{ category: "laptops", brand: brand.slug }}>
              See all {brand.name} models & get a quote <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            How to sell your {brand.name} laptop in Bangalore
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Three simple steps to instant cash for your used {brand.name} laptop.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BadgeIndianRupee,
                title: "Get an instant quote",
                text: `Select your ${brand.name} model, answer a few condition questions and see your price instantly.`,
              },
              {
                icon: Truck,
                title: "Free doorstep pickup",
                text: "Book a convenient slot. Our verified agent comes to your Bangalore address and verifies the laptop.",
              },
              {
                icon: Wallet,
                title: "Instant payment",
                text: "Once verified, get paid instantly via UPI or bank transfer — no waiting, no deductions.",
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
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeIndianRupee, title: "Best price", text: `Live valuation for ${brand.name} laptops in Bangalore.` },
              { icon: ShieldCheck, title: "Safe & data-wiped", text: "Certified data erasure on every laptop we collect." },
              { icon: Truck, title: "Free pickup", text: "Doorstep collection across all Bangalore localities." },
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

      {/* LOCATIONS */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Sell your {brand.name} laptop across Bangalore
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Free doorstep pickup in every major Bangalore locality. Tap your area for a dedicated
            local page.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {areas.map((area) => (
              <Link
                key={area.slug}
                to="/sell-used-laptop/$area"
                params={{ area: area.slug }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <MapPin className="size-4 text-primary" />
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Selling a {brand.name} laptop — FAQs
          </h2>
          <div className="mt-8 space-y-3">
            {brand.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER BRANDS */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Sell other laptop brands</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherBrands.map((b) => (
              <Link
                key={b.slug}
                to="/sell-old-laptop/$brand"
                params={{ brand: b.slug }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Laptop className="size-4 text-primary" />
                Sell {b.name} laptop
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Ready to sell your {brand.name} laptop in Bangalore?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Get your free instant quote now and book a same-day doorstep pickup anywhere in
            Bangalore.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/sell/$category/$brand" params={{ category: "laptops", brand: brand.slug }}>
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
