import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import {
  repairCategories,
  repairServices,
  getRepairService,
  formatRepairPrice,
  repairPriceDisclaimer,
} from "@/lib/repair-services";
import { pageMetadata } from "@/lib/metadata";
import { ServiceIcon } from "@/components/repair/ServiceIcon";
import { ServiceBookingForm } from "@/components/repair/ServiceBookingForm";
import { JsonLd } from "@/components/JsonLd";
import { repairServiceFaqs, repairServiceSchema } from "@/lib/repair-seo";

export function generateStaticParams() {
  return repairServices.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const service = getRepairService((await params).slug);
  if (!service) notFound();
  return pageMetadata(
    service.landingPageUrl,
    `${service.serviceName} in Bangalore | Zapiboo`,
    `${service.description} Starting at ${formatRepairPrice(service.startingPrice)}. Confirm pricing for your model before booking.`,
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const service = getRepairService((await params).slug);
  if (!service) notFound();
  const category = repairCategories.find((item) => item.id === service.vehicleCategory)!;
  return (
    <>
      <JsonLd data={repairServiceSchema(service)} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-14 lg:px-8">
        <Link
          href="/repair#repair-vehicles"
          className="inline-flex min-h-9 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All vehicle services
        </Link>
        <div className="mt-4 max-w-3xl">
          <header className="flex items-start gap-3 sm:gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:size-12">
              <ServiceIcon name={service.icon} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">{category.label}</p>
              <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {service.serviceName}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
                {service.description}
              </p>
            </div>
          </header>
          <section
            aria-label="Booking enquiry"
            className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft sm:mt-8 sm:p-8"
          >
            <h2 className="text-xl font-bold">Request this service</h2>
            <ServiceBookingForm
              serviceName={service.serviceName}
              category={category.label}
              startingPrice={formatRepairPrice(service.startingPrice)}
              priceDisclaimer={repairPriceDisclaimer}
            />
          </section>
          <section className="mt-8 rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold">Service scope</h2>
            <ul className="mt-5 space-y-3">
              {service.highlights.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm leading-6">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              The team will confirm the applicable checks and work for your model before booking.
              Any additional work requires your approval.
            </p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-bold">What is not included</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Replacement parts, oil, filters and other consumables are not represented as included
              in the starting price. Ask for an itemised estimate. Additional repairs, pickup
              charges and specialist work must be quoted and approved separately.
            </p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-bold">Vehicle compatibility</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{category.compatibility}</p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-bold">How your booking works</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6">
              {[
                "Share your model, engine capacity or EV type, locality and concerns.",
                "Review the service scope, availability and itemised estimate with the team.",
                "Approve the agreed work and confirm an appointment. Further work needs your approval.",
              ].map((text, index) => (
                <li key={text} className="flex gap-3">
                  <span className="font-bold text-primary">0{index + 1}</span>
                  {text}
                </li>
              ))}
            </ol>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-bold">Warranty</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Warranty terms for this service have not been published. Ask the team to confirm any
              applicable workmanship or parts coverage, duration and exclusions in writing before
              booking.
            </p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-bold">Service reviews</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              No verified reviews have been published for this package yet.
            </p>
          </section>
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold">Common questions</h2>
            {repairServiceFaqs.map(({ question, answer }) => (
              <details key={question} className="group border-b border-border">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 group-open:rotate-180"
                  />
                </summary>
                <p className="pb-5 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
