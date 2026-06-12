import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { householdRates } from "@/lib/bangalore-data";
import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  getAreaBySlug,
  organizationSchema,
  serviceSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-scrap.webp";

export const Route = createFileRoute("/areas_/$area")({
  loader: ({ params }) => {
    const area = getAreaBySlug(params.area);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ params }) => {
    const area = getAreaBySlug(params.area);
    if (!area) return {};
    const title = `Best Scrap Buyers in ${area.name}, Bangalore | Doorstep Scrap Collection`;
    const description = `Sell scrap online in ${area.name}, Bangalore with HuluMart. Book doorstep scrap collection for paper, metal, plastic, e-waste and appliances with certified weighing and instant payment.`;
    const path = `/areas/${area.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:image", content: heroImg },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            organizationSchema(path),
            serviceSchema(path, area),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: `Scrap Buyers in ${area.name}`, path },
            ]),
          ]),
        },
      ],
    };
  },
  component: AreaLandingPage,
});

function AreaLandingPage() {
  const { area } = Route.useLoaderData();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={`Scrap collection service for ${area.name}, Bangalore`}
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-navy/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-green">
              Scrap pickup in {area.name}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Best Scrap Buyers in <span className="text-gradient">{area.name}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              HuluMart offers doorstep scrap collection in {area.name}, Bangalore for paper,
              raddi, metal, plastic, e-waste and old appliances. Get transparent rates,
              certified weighing and instant payment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/pickup">
                  Book pickup in {area.name}
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
                <Star className="size-4 fill-brand-green text-brand-green" /> 4.9/5 pickup rating
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-green" /> Same-day slots available
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-brand-green" /> Pincode {area.pincode}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              What we buy
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Scrap collection for homes, shops and apartments in {area.name}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Book one pickup for mixed household scrap or select specific materials. Our agent
              confirms the slot, arrives at your address, weighs everything in front of you, and
              completes payment after pickup.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {householdRates.slice(0, 6).map((rate) => (
                <div key={rate.name} className="rounded-xl border border-border bg-card p-4">
                  <h3 className="text-sm font-bold">{rate.name}</h3>
                  <p className="mt-2 text-lg font-extrabold text-primary">
                    {rate.price} <span className="text-xs font-medium text-muted-foreground">{rate.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">Why choose HuluMart in {area.name}?</h2>
              <ul className="mt-5 space-y-4">
                {[
                  "Free doorstep pickup for serviceable Bangalore pincodes",
                  "Certified digital weighing at your doorstep",
                  "Transparent rates before collection",
                  "Instant payment after pickup",
                  "Support for paper, plastic, metal, appliances and e-waste",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {area.nearby.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold">Nearby localities</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {area.nearby.map((nearby) => (
                      <span key={nearby} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                        {nearby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
