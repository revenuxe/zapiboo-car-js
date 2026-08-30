import {
  CalendarClock,
  Truck,
  Wallet,
  ShieldCheck,
  FileCheck2,
  Globe2,
  BarChart3,
  Car,
} from "lucide-react";

export type Material = {
  slug: string;
  name: string;
  price: string;
  unit: string;
  blurb: string;
  trend: string;
};

/** Indicative resale price bands for used vehicles in Bangalore. */
export const materials: Material[] = [
  {
    slug: "hatchback",
    name: "Used Hatchbacks",
    price: "₹1.2L",
    unit: "onwards",
    blurb: "Swift, i10, Alto, Baleno and other city hatchbacks.",
    trend: "Fastest selling",
  },
  {
    slug: "sedan",
    name: "Used Sedans",
    price: "₹2.5L",
    unit: "onwards",
    blurb: "Dzire, City, Verna, Ciaz and premium sedans.",
    trend: "High demand",
  },
  {
    slug: "suv",
    name: "Used SUVs",
    price: "₹4.5L",
    unit: "onwards",
    blurb: "Creta, Venue, Brezza, Seltos, XUV and MUVs.",
    trend: "Best resale value",
  },
  {
    slug: "bikes",
    name: "Used Bikes",
    price: "₹28,000",
    unit: "onwards",
    blurb: "Splendor, Pulsar, Apache, Classic 350 and sports bikes.",
    trend: "Quick payout",
  },
  {
    slug: "scooters",
    name: "Used Scooters",
    price: "₹22,000",
    unit: "onwards",
    blurb: "Activa, Access, Jupiter, Ntorq and electric scooters.",
    trend: "Popular",
  },
  {
    slug: "commercial",
    name: "Commercial Vehicles",
    price: "Quoted",
    unit: "on inspection",
    blurb: "Auto rickshaws, mini trucks, tempos and fleet cars.",
    trend: "Bulk friendly",
  },
];

export const steps = [
  {
    icon: CalendarClock,
    title: "Share your vehicle in 60 seconds",
    text: "Pick your car, bike or scooter, add the year, kilometres and your Bangalore locality. No haggling, no long phone calls.",
  },
  {
    icon: Truck,
    title: "Free doorstep inspection",
    text: "A ZAPIBOO evaluator visits your home or office, checks the vehicle and paperwork, and confirms a fair market price on the spot.",
  },
  {
    icon: Wallet,
    title: "Instant payment, free RC transfer",
    text: "Accept the offer and get paid the same day. We handle the RC transfer and NOC paperwork end to end.",
  },
];

export const features = [
  {
    icon: ShieldCheck,
    title: "Fair, market-linked pricing",
    text: "Every offer is benchmarked against live Bangalore resale demand for your make, model, variant and year.",
  },
  {
    icon: Wallet,
    title: "Same-day payment",
    text: "Money is transferred to your bank the moment you accept the offer — no instalments and no held-back deposits.",
  },
  {
    icon: FileCheck2,
    title: "Free RC transfer & NOC",
    text: "We complete the ownership transfer, insurance updates and RTO paperwork at no extra cost to you.",
  },
  {
    icon: Globe2,
    title: "Doorstep across Bangalore",
    text: "Inspections at homes, apartments and offices in Whitefield, HSR, Koramangala, Hebbal, JP Nagar and 40+ areas.",
  },
  {
    icon: Car,
    title: "Verified used vehicles to buy",
    text: "Inspected, accident-checked cars, bikes and scooters with clear documents and transparent history.",
  },
  {
    icon: BarChart3,
    title: "Dealers & fleets welcome",
    text: "Bulk buying and selling support for dealerships, cab fleets and companies retiring their vehicles.",
  },
];

export const stats = [
  { value: "40+", label: "Bangalore areas" },
  { value: "8K+", label: "Vehicles sold" },
  { value: "60 min", label: "Free inspection" },
  { value: "4.9/5", label: "Seller rating" },
];

export const testimonials = [
  {
    quote:
      "Sold my 2016 Swift from our HSR Layout apartment. The evaluator came in the slot I picked, the price matched the online estimate, and the money hit my account the same evening.",
    name: "Nikhil Rao",
    role: "Sold a Maruti Swift, HSR Layout",
  },
  {
    quote:
      "I was worried about the RC transfer after selling my Activa in Whitefield. ZAPIBOO handled the paperwork and sent me the confirmation without a single RTO visit.",
    name: "Ananya Shetty",
    role: "Sold a Honda Activa, Whitefield",
  },
  {
    quote:
      "Bought a well-kept Hyundai Creta near Indiranagar. Service history and insurance were shared upfront, so there were no surprises after the purchase.",
    name: "Faisal Ahmed",
    role: "Bought a Hyundai Creta, Indiranagar",
  },
];

export const navLinks = [
  { to: "/materials", label: "Price guide" },
  { to: "/contact", label: "Contact" },
] as const;

// Trimmed set shown in the site header (the rest live only in the footer).
export const headerNavLinks = [
  { to: "/materials", label: "Price guide" },
  { to: "/contact", label: "Contact" },
] as const;
