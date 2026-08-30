import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import {
  absoluteUrl,
  breadcrumbSchema,
  organizationSchema,
  serviceAreas,
  serviceSchema,
} from "@/lib/seo";

const areasTitle = "Scrap Pickup Areas in Bangalore | HuluMart";
const areasDescription =
  "See all Bangalore areas served by HuluMart for doorstep scrap collection, certified weighing and instant payment.";

export const Route = createFileRoute("/areas")({
  head: () => ({
    meta: [
      { title: areasTitle },
      { name: "description", content: areasDescription },
      { property: "og:title", content: areasTitle },
      { property: "og:description", content: areasDescription },
      { property: "og:url", content: absoluteUrl("/areas") },
    ],
    links: [{ rel: "canonical", href: "/areas" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/areas"),
          serviceSchema("/areas"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Areas", path: "/areas" },
          ]),
        ]),
      },
    ],
  }),
  component: AreasPage,
});

function AreasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Areas we serve"
        title={<>Scrap Pickup Areas in Bangalore</>}
        subtitle="HuluMart covers major Bangalore neighbourhoods for convenient doorstep scrap collection, transparent rates and certified weighing."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Book a pickup
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Bangalore coverage
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Find your locality
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose your area to view the dedicated local scrap buyer page, nearby service
              localities and pickup details.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {serviceAreas.map((area, index) => (
              <Reveal key={area.slug} delay={(index % 4) * 0.04}>
                <Link
                  to="/areas/$area"
                  params={{ area: area.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevated sm:p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <MapPin className="size-5" />
                  </span>
                  <span className="mt-4 font-bold leading-tight">{area.name}</span>
                  <span className="mt-1 text-sm text-muted-foreground">{area.pincode}</span>
                  {area.nearby.length > 0 && (
                    <span className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      Near {area.nearby.slice(0, 2).join(", ")}
                    </span>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            "Free pickup in serviceable pincodes",
            "Certified digital weighing",
            "Instant payment after collection",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-card p-6 shadow-soft">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
