import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";
import heroImg from "@/assets/hero-vehicles.webp";
import carImg from "@/assets/vehicle-car.webp";
import suvImg from "@/assets/vehicle-suv.webp";
import electricImg from "@/assets/vehicle-electric.webp";
import commercialImg from "@/assets/vehicle-commercial.webp";

const vehicles = [
  { title: "Sell your car", image: carImg }, { title: "Sell an SUV", image: suvImg },
  { title: "Electric vehicle", image: electricImg }, { title: "Commercial vehicle", image: commercialImg },
];

export const Route = createFileRoute("/sell-used-car")({
  head: () => ({ meta: [{ title: "Sell Used Car in Bangalore | Zapiboo" }, { name: "description", content: "Sell your used car in Bangalore with a fair offer, free inspection and same-day payment." }], links: [{ rel: "canonical", href: "/sell-used-car" }] }),
  component: SellUsedCar,
});

function SellUsedCar() {
  return <>
    <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
      <div className="absolute inset-0"><img src={heroImg} alt="Sell used car in Bangalore" className="h-full w-full object-cover opacity-30" /><div className="absolute inset-0 bg-navy/45" /></div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"><div className="max-w-5xl">
        <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">Sell your used <span className="text-[#b63b35]">car</span> in <span className="text-[#b63b35]">Bangalore</span></h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-navy-foreground/80">Get a fair, market-linked offer with free doorstep inspection, same-day payment and RC transfer support.</p>
        <div className="mt-7 max-w-md"><Button asChild variant="hero" size="xl" className="w-full"><Link to="/pickup">Get free valuation <ArrowRight /></Link></Button><div className="my-4 flex items-center gap-3 text-xs font-semibold text-navy-foreground/70"><span className="h-px flex-1 bg-white/25" />OR<span className="h-px flex-1 bg-white/25" /></div><a href={`https://wa.me/91${businessContact.phone}?text=${encodeURIComponent("Hi Zapiboo, I want a free valuation for my used car in Bangalore.")}`} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00C875] px-5 py-4 text-base font-bold text-white"><WhatsAppIcon className="size-6" />Sell instantly on WhatsApp</a></div>
        <p className="mt-5 flex items-center gap-2 whitespace-nowrap text-[11px] text-navy-foreground/70 sm:text-sm"><CheckCircle2 className="size-4 shrink-0 text-brand-green" />Transparent offer · Doorstep inspection · Secure payment</p>
      </div></div>
    </section>
    <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold sm:text-4xl">Start with your vehicle</h2><p className="mt-3 max-w-2xl text-lg text-muted-foreground">Choose a category and the valuation flow opens with your vehicle type already selected.</p><div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{vehicles.map((vehicle) => <Link key={vehicle.title} to="/pickup" className="group flex min-h-40 flex-col justify-end rounded-[1.75rem] border border-primary/20 bg-primary/5 p-3 shadow-soft transition-all hover:-translate-y-1 sm:min-h-52 sm:p-5"><img src={vehicle.image} alt="" className="mx-auto h-24 w-full object-contain transition-transform group-hover:scale-105 sm:h-32" /><span className="mt-3 text-center text-sm font-bold sm:mt-4 sm:text-lg">{vehicle.title}</span></Link>)}</div></div></section>
  </>;
}
