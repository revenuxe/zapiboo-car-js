"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Car, ShieldCheck, Wallet } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { businessContact } from '@/lib/seo';
import car from '@/assets/vehicle-car.webp';
import bike from '@/assets/vehicle-bike.webp';
import scooter from '@/assets/vehicle-scooter.webp';

const vehicles = [
  { image: car, title: 'Sell your used car', types: ['Hatchback', 'Sedan', 'SUV', 'Electric'] },
  { image: bike, title: 'Sell your used bike', types: ['Commuter', 'Sports', 'Cruiser'] },
  { image: scooter, title: 'Sell your used scooter', types: ['Petrol', 'Electric', 'City scooters'] },
];
const benefits = [
  { icon: Car, title: 'Doorstep inspection' },
  { icon: ShieldCheck, title: 'Free RC transfer' },
  { icon: Wallet, title: 'Same-day payment' },
];

export function HomeHero() {
  const [active, setActive] = useState(0);
  const vehicle = vehicles[active];
  return <section aria-label="Sell your vehicle" className="relative isolate overflow-hidden bg-[#121112] text-white">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_46%_43%,rgba(18,64,80,0.48),transparent_62%)]" />
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:min-h-[570px] lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10 lg:px-8 lg:py-12">
      <div>
        <h1 className="max-w-[570px] text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl xl:text-[52px]">Sell Your Used <span className="text-[#c83232]">Car</span> Or <span className="text-[#c83232]">Bike</span> In <span className="text-[#c83232]">Bangalore</span></h1>
        <p className="mt-6 max-w-[520px] text-base leading-[1.6] text-white/75 sm:text-lg">Get a fair, market-linked offer with free doorstep inspection, same-day payment and RC transfer for cars, bikes and scooters.</p>
        <div className="mt-8 flex flex-col items-stretch gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <Link href="/pickup" className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#c72b2e] px-6 text-sm font-bold transition-colors hover:bg-[#ac2326] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto">Get free valuation <ArrowRight className="size-4" /></Link>
          <div className="flex w-full items-center gap-3 text-xs font-semibold text-white/60 lg:hidden"><span className="h-px flex-1 bg-white/20" />OR<span className="h-px flex-1 bg-white/20" /></div>
          <a href={`https://wa.me/91${businessContact.phone}?text=${encodeURIComponent('Hi Zapiboo, I want a free valuation for my used vehicle in Bangalore.')}`} target="_blank" rel="noreferrer" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-sm font-bold transition-colors hover:border-[#00C875] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"><WhatsAppIcon className="size-5 text-[#00C875]" />Sell instantly on WhatsApp</a>
        </div>
        <div className="mt-9 grid grid-cols-3 gap-3">
          {benefits.map(({ icon: Icon, title }) => <div key={title} className="rounded-lg border border-white/[0.07] bg-white/[0.045] p-3.5 sm:p-4"><Icon aria-hidden="true" className="mb-3 size-6 text-[#d33636]" /><h2 className="text-xs font-extrabold leading-snug sm:text-sm">{title}</h2></div>)}
        </div>
        <div className="mt-7 hidden items-center gap-4 lg:flex">
          <button type="button" aria-label="Previous vehicle" onClick={() => setActive((active + vehicles.length - 1) % vehicles.length)} className="flex h-9 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"><ChevronLeft className="size-5" /></button>
          <span className="text-xs font-semibold tabular-nums" aria-live="polite">{active + 1} / {vehicles.length}</span>
          <button type="button" aria-label="Next vehicle" onClick={() => setActive((active + 1) % vehicles.length)} className="flex h-9 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <div className="hidden min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-4 pb-5 sm:p-5 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pb-10">
        <div className="mb-1 flex items-center justify-between lg:mb-2 lg:justify-end">
          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" aria-label="Previous vehicle" onClick={() => setActive((active + vehicles.length - 1) % vehicles.length)} className="flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"><ChevronLeft className="size-5" /></button>
            <span className="min-w-9 text-center text-xs font-semibold tabular-nums" aria-live="polite">{active + 1} / {vehicles.length}</span>
            <button type="button" aria-label="Next vehicle" onClick={() => setActive((active + 1) % vehicles.length)} className="flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"><ChevronRight className="size-5" /></button>
          </div>
          <span className="rounded-full bg-[#c72b2e] px-3 py-1 text-[11px] font-bold">Free valuation</span>
        </div>
        <div className="relative"><div aria-hidden="true" className="absolute inset-x-8 bottom-6 h-8 rounded-[50%] bg-black/65 blur-xl" /><Image src={vehicle.image} alt={vehicle.title} sizes="(min-width: 1280px) 590px, (min-width: 1024px) 48vw, 100vw" preload={active === 0} className="relative aspect-[1.65] max-h-64 w-full object-contain lg:max-h-none" /></div>
        <div className="mt-1 text-center lg:mt-5 lg:text-left" aria-live="polite"><h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{vehicle.title}</h2><div className="mt-3 flex flex-wrap justify-center gap-2 lg:mt-4">{vehicle.types.map(type => <span key={type} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/75">{type}</span>)}</div></div>
      </div>
    </div>
  </section>;
}
