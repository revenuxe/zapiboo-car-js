import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { materials } from "@/lib/site-data";

export const Route = createFileRoute("/materials")({
  head: () => ({ meta: [{ title: "Used Vehicle Price Guide in Bangalore | ZAPIBOO" }, { name: "description", content: "Indicative starting prices for used cars, bikes and scooters in Bangalore." }] }),
  component: PriceGuide,
});

function PriceGuide() {
  return <main className="bg-background"><PageHeader title={<>Used vehicle <span className="text-gradient">price guide</span></>} subtitle="Starting price bands for popular used vehicles in Bangalore. Your free doorstep valuation reflects the vehicle's condition, service history, ownership and local demand." /><section className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{materials.map((item) => <article key={item.slug} className="rounded-2xl border border-border bg-card p-6 shadow-soft"><Car className="size-7 text-primary" /><p className="mt-5 text-sm font-semibold text-primary">{item.trend}</p><h2 className="mt-1 text-xl font-bold">{item.name}</h2><p className="mt-2 text-sm text-muted-foreground">{item.blurb}</p><p className="mt-5 text-3xl font-extrabold">{item.price}</p><p className="text-sm text-muted-foreground">{item.unit}</p></article>)}</div><div className="mt-12 rounded-3xl bg-gradient-navy p-8 text-navy-foreground sm:p-10"><h2 className="text-2xl font-bold">Get a price for your exact vehicle</h2><p className="mt-2 max-w-2xl text-navy-foreground/75">Tell us your vehicle type and preferred inspection slot. An evaluator will confirm a transparent, market-linked offer at your doorstep.</p><Button asChild variant="hero" size="lg" className="mt-6"><Link to="/pickup">Book free valuation <ArrowRight /></Link></Button></div></section></main>;
}
