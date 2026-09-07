import Image from "next/image";
import { ArrowRight, Car, Wallet, ShieldCheck } from "lucide-react";
import { CarValuationForm } from "@/components/CarValuationForm";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";
import inspection from "@/assets/doorstep-inspection.webp";

export function CarSellingHero() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#121112] pb-24 pt-12 text-white sm:pt-16 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(31,89,104,0.35),transparent_65%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              A Simpler Way to Sell · Bangalore
            </p>
            <h1 className="mt-5 max-w-xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
              Sell Your Used Car <span className="text-[#e54b4b]">With Confidence.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Get a fair, market-linked offer with a free doorstep inspection in Bangalore. Share
              your car details, meet the team and decide when the offer is right for you.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                [Car, "Free Doorstep Inspection"],
                [Wallet, "Clear Offer Discussion"],
                [ShieldCheck, "RC Transfer Support"],
              ].map(([Icon, title]) => {
                const BenefitIcon = Icon as typeof Car;
                return (
                  <div
                    key={String(title)}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
                  >
                    <BenefitIcon aria-hidden="true" className="mb-3 size-6 text-[#e54b4b]" />
                    <p className="text-xs font-bold leading-relaxed sm:text-sm">{String(title)}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col items-stretch gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <a
                href="#car-valuation"
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#c72b2e] px-6 text-sm font-bold transition-colors hover:bg-[#ac2326] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"
              >
                Get free valuation <ArrowRight className="size-4" />
              </a>
              <div className="flex w-full items-center gap-3 text-xs font-semibold text-white/60 lg:hidden">
                <span className="h-px flex-1 bg-white/20" />
                OR
                <span className="h-px flex-1 bg-white/20" />
              </div>
              <a
                href={`https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Zapiboo, I want a free valuation for my used car in Bangalore.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-sm font-bold transition-colors hover:border-[#00C875] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"
              >
                <WhatsAppIcon className="size-5 text-[#00C875]" />
                Discuss on WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden min-w-0 lg:block">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={inspection}
                alt="Doorstep vehicle inspection"
                loading="lazy"
                sizes="(min-width: 1024px) 560px, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <ol className="mt-4 grid grid-cols-3 gap-3">
              {["Share Details", "Get Inspected", "Review Your Offer"].map((label, index) => (
                <li key={label} className="text-xs leading-relaxed text-white/75">
                  <span className="mb-1 block text-sm font-extrabold text-[#e54b4b]">
                    0{index + 1}
                  </span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <div
        id="car-valuation"
        className="relative z-10 mx-auto -mt-14 max-w-4xl scroll-mt-24 px-4 sm:px-6"
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-8">
          <CarValuationForm />
        </div>
      </div>
    </>
  );
}
