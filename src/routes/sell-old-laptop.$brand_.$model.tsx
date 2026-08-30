import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
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
import { getLaptopModel, modelSlug } from "@/lib/laptop-brands";

export const Route = createFileRoute("/sell-old-laptop/$brand_/$model")({
  loader: ({ params }) => {
    const found = getLaptopModel(params.brand, params.model);
    if (!found) throw notFound();
    return found;
  },
  head: ({ params }) => {
    const found = getLaptopModel(params.brand, params.model);
    if (!found) return {};
    const { brand, name } = found;
    const path = `/sell-old-laptop/${brand.slug}/${modelSlug(name)}`;
    const title = `Sell ${name} in Bangalore - Instant Cash Price | ZAPIBOO`;
    const description = `Sell your used ${name} in Bangalore for the best price. Free instant quote, free doorstep pickup and same-day UPI payment. Certified data wiping on every laptop.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: [
            `sell ${name.toLowerCase()} bangalore`,
            `used ${name.toLowerCase()} price bangalore`,
            `${brand.name.toLowerCase()} buyer bangalore`,
          ].join(", "),
        },
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
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Sell Laptop", path: "/sell/laptops" },
              { name: `Sell ${brand.name} Laptop`, path: `/sell-old-laptop/${brand.slug}` },
              { name: `Sell ${name}`, path },
            ]),
            faqSchema([
              {
                question: `How much can I get for my used ${name} in Bangalore?`,
                answer: `The price depends on the exact configuration (processor, RAM, storage), age and condition of your ${name}. Get a free instant quote to see your exact offer with free doorstep pickup and instant payment.`,
              },
              {
                question: `Do you buy a ${name} with a cracked screen or battery issues?`,
                answer: `Yes. We buy every ${name} - working perfectly or with issues like a cracked screen, weak battery or slow performance. The price is adjusted fairly and you still get instant cash.`,
              },
              {
                question: `Is my data safe when I sell my ${name}?`,
                answer: `Absolutely. We perform certified data wiping on every laptop we collect, so your personal files and accounts are permanently removed.`,
              },
            ]),
          ]),
        },
      ],
    };
  },
  component: SellModelPage,
});

function SellModelPage() {
  const { brand, name } = Route.useLoaderData();
  const areas = serviceAreas.filter((a) => featuredServiceAreas.includes(a.slug)).slice(0, 12);
  const otherModels = brand.models.filter((m: string) => m !== name).slice(0, 8);
  const whatsappHref = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(
    `Hi ZAPIBOO, I want to sell my ${name} in Bangalore. Please share a quote.`,
  )}`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-green/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-green">
            Sell {brand.name} laptop
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] sm:text-5xl">
            Sell Your <span className="text-gradient">{name}</span> in Bangalore
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
            Get the best resale price for your used {name} with a free instant quote, free doorstep
            pickup and same-day UPI payment across Bengaluru.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/sell/$category/$brand" params={{ category: "laptops", brand: brand.slug }}>
                Get instant {name} quote <ArrowRight />
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
              <BadgeIndianRupee className="size-4 text-brand-green" /> {brand.priceRange}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-brand-green" /> Same-day pickup
            </span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Best price for your {name} in Bangalore
            </h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Want to sell your old {name}? ZAPIBOO pays the best resale price in Bangalore. Our
                valuation is benchmarked to the live second-hand market and accounts for your exact
                configuration - processor, RAM, storage and graphics - so you get a fair, transparent
                offer every time.
              </p>
              <p>
                Whether your {name} is in mint condition or has a cracked screen, weak battery or slow
                performance, we make an honest, condition-based offer. Get a free instant quote, book a
                free doorstep pickup and get paid instantly via UPI or bank transfer.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">Why sell your {name} with ZAPIBOO?</h2>
              <ul className="mt-5 space-y-4">
                {[
                  `Best resale price for the ${name} in Bangalore`,
                  "Free doorstep pickup across all of Bengaluru",
                  "Instant quote based on your exact configuration",
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
                  Get my {name} price <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeIndianRupee, title: "Best price", text: `Live valuation for the ${name}.` },
              { icon: ShieldCheck, title: "Safe & data-wiped", text: "Certified data erasure on every laptop." },
              { icon: Truck, title: "Free pickup", text: "Doorstep collection across Bangalore." },
              { icon: Wallet, title: "Instant payment", text: "Money in your account after verification." },
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

      {/* OTHER MODELS */}
      {otherModels.length > 0 && (
        <section className="bg-background py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Other {brand.name} models we buy</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {otherModels.map((m: string) => (
                <Link
                  key={m}
                  to="/sell-old-laptop/$brand/$model"
                  params={{ brand: brand.slug, model: modelSlug(m) }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  Sell {m}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCATIONS */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Sell your {name} across Bangalore</h2>
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

      {/* CTA */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to sell your {name}?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Get your free instant quote now and book a same-day doorstep pickup anywhere in Bangalore.
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
