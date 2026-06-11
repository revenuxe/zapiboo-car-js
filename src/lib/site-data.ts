import {
  CalendarClock,
  Truck,
  Wallet,
  ShieldCheck,
  Leaf,
  Globe2,
  BarChart3,
  Recycle,
} from "lucide-react";

export type Material = {
  slug: string;
  name: string;
  price: string;
  unit: string;
  blurb: string;
  trend: string;
};

export const materials: Material[] = [
  { slug: "copper", name: "Copper", price: "$6.80", unit: "/ kg", blurb: "Bright & bare wire, tubing, and bus bars.", trend: "+4.2%" },
  { slug: "aluminium", name: "Aluminium", price: "$1.45", unit: "/ kg", blurb: "Cans, extrusions, sheets, and cast alloy.", trend: "+1.8%" },
  { slug: "brass", name: "Brass", price: "$4.10", unit: "/ kg", blurb: "Fittings, valves, and yellow brass scrap.", trend: "+2.6%" },
  { slug: "steel", name: "Iron & Steel", price: "$0.32", unit: "/ kg", blurb: "Structural steel, sheet, and heavy melt.", trend: "+0.9%" },
  { slug: "e-waste", name: "E-Waste", price: "$2.20", unit: "/ kg", blurb: "Boards, devices, and certified data wipe.", trend: "+6.1%" },
  { slug: "lead", name: "Lead", price: "$1.90", unit: "/ kg", blurb: "Batteries, sheet, and soft lead scrap.", trend: "+1.1%" },
  { slug: "stainless", name: "Stainless", price: "$1.35", unit: "/ kg", blurb: "304 / 316 grade off-cuts and vessels.", trend: "+3.4%" },
  { slug: "paper", name: "Paper & Card", price: "$0.14", unit: "/ kg", blurb: "OCC, mixed paper, and shredded stock.", trend: "+0.4%" },
];

export const steps = [
  {
    icon: CalendarClock,
    title: "Book in 60 seconds",
    text: "Pick a material, a time slot, and your address. No phone calls, no haggling at the gate.",
  },
  {
    icon: Truck,
    title: "We come to your door",
    text: "A vetted HuluMart agent arrives on schedule, weighs on certified scales, and shows live rates.",
  },
  {
    icon: Wallet,
    title: "Get paid instantly",
    text: "Accept the digital quote and money lands in your wallet or bank the moment we load up.",
  },
];

export const features = [
  { icon: ShieldCheck, title: "Certified weighing", text: "Tamper-proof, calibrated scales with a digital receipt for every pickup." },
  { icon: Wallet, title: "Live transparent rates", text: "Prices indexed to global commodity markets — updated daily, never guessed." },
  { icon: Globe2, title: "Global buyer network", text: "Your scrap routes to the highest-paying verified recyclers worldwide." },
  { icon: Leaf, title: "Traceable & green", text: "Every kilogram tracked from doorstep to mill with a carbon-saved report." },
  { icon: BarChart3, title: "Business dashboards", text: "Volume sellers get analytics, scheduled routes, and consolidated payouts." },
  { icon: Recycle, title: "Zero landfill promise", text: "We divert and recover, never dump. Recycling done responsibly at scale." },
];

export const stats = [
  { value: "180K+", label: "Tonnes traded" },
  { value: "42", label: "Countries served" },
  { value: "$96M", label: "Paid to sellers" },
  { value: "4.9/5", label: "Pickup rating" },
];

export const testimonials = [
  {
    quote:
      "We replaced three middlemen with one app. Doorstep pickup, fair weights, instant payment — HuluMart changed how our workshop sells scrap.",
    name: "Marcus Reyel",
    role: "Owner, Reyel Fabrication",
  },
  {
    quote:
      "The live pricing alone pays for itself. Our facility moves 40 tonnes a month and the dashboards make payouts effortless.",
    name: "Priya Nandakumar",
    role: "Ops Lead, NovaSteel Recycling",
  },
  {
    quote:
      "Booked a pickup on Sunday, paid by Monday. As a household it finally feels easy to recycle and actually get rewarded.",
    name: "Daniel Okoro",
    role: "Household seller, Lagos",
  },
];

export const navLinks = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/materials", label: "Materials & Prices" },
  { to: "/business", label: "For Business" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;
