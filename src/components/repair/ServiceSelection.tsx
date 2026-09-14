"use client";

import { useState } from "react";
import { Bike, Car, Zap, ArrowRight, ClipboardCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { repairCategories, repairServices, repairPriceDisclaimer } from "@/lib/repair-services";
import { businessContact } from "@/lib/seo";
import { ServiceCard } from "./ServiceCard";

const icons = { bike: Bike, car: Car, ev: Zap };

export function ServiceSelection() {
  const [category, setCategory] = useState<string>(repairCategories[0].id);
  const label = repairCategories.find((item) => item.id === category)!.label;
  const enquiry = (request: string) =>
    `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Zapiboo, I would like ${request} for my vehicle (${label}) in Bangalore.\nModel: \nLocality: \nIssue: `)}`;
  return (
    <section
      id="repair-vehicles"
      aria-labelledby="repair-selection-title"
      className="scroll-mt-24 border-b border-border bg-background py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="repair-selection-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Care that keeps you moving.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Choose your vehicle and find the right service for it. We’ll confirm the exact price for
            your model before any additional work.
          </p>
        </div>
        <Tabs value={category} onValueChange={setCategory} className="mt-7">
          <TabsList
            aria-label="Vehicle category"
            className="h-auto w-full max-w-md justify-start gap-1 rounded-full border border-border bg-secondary/60 p-1.5"
          >
            {repairCategories.map((item) => {
              const Icon = icons[item.icon];
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="min-h-11 flex-1 gap-2 rounded-full px-2 text-xs font-semibold transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:px-4 sm:text-sm"
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {repairCategories.map((item) => (
            <TabsContent
              key={item.id}
              value={item.id}
              className="mt-8 scroll-mt-24 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
            >
              <div id={item.id === category ? "repair-services" : undefined} className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {repairServices
                  .filter((service) => service.vehicleCategory === item.id)
                  .map((service) => (
                    <ServiceCard key={service.slug} service={service} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <p className="mt-5 max-w-4xl text-xs leading-6 text-muted-foreground">
          {repairPriceDisclaimer}
        </p>
        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Not sure what your vehicle needs?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tell us what&apos;s wrong and we&apos;ll help you choose the right service.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <a
              href={enquiry("a service recommendation")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-4 text-center text-sm font-bold text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Get a Service Recommendation
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
            <a
              href={enquiry(
                "to book a vehicle inspection; please confirm availability and pricing",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ClipboardCheck aria-hidden="true" className="size-4" />
              Book a Vehicle Inspection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
