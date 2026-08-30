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
  { slug: "copper", name: "Copper", price: "₹520", unit: "/ kg", blurb: "Wire, tubing, and copper household scrap.", trend: "High demand" },
  { slug: "aluminium", name: "Aluminium", price: "₹105", unit: "/ kg", blurb: "Utensils, sheets, cans, and profiles.", trend: "Stable" },
  { slug: "brass", name: "Brass", price: "₹330", unit: "/ kg", blurb: "Fittings, valves, and yellow brass scrap.", trend: "High value" },
  { slug: "steel", name: "Iron & Steel", price: "₹28", unit: "/ kg", blurb: "Rods, grills, sheets, and mixed iron.", trend: "Daily rate" },
  { slug: "e-waste", name: "E-Waste", price: "₹35", unit: "/ kg", blurb: "Small devices, boards, cables, and chargers.", trend: "Handled safely" },
  { slug: "paper", name: "Paper & Raddi", price: "₹15", unit: "/ kg", blurb: "Newspaper, books, cardboard, and magazines.", trend: "Popular" },
];

export const steps = [
  {
    icon: CalendarClock,
    title: "Book in 60 seconds",
    text: "Choose your scrap type, pickup slot, and Bangalore address. No haggling, no long phone calls.",
  },
  {
    icon: Truck,
    title: "We come to your door",
    text: "A verified ZAPIBOO agent arrives on schedule, weighs on a certified scale, and shows the rate clearly.",
  },
  {
    icon: Wallet,
    title: "Get paid instantly",
    text: "Approve the quote and get paid instantly once your scrap is collected.",
  },
];

export const features = [
  { icon: ShieldCheck, title: "Certified weighing", text: "Tamper-proof, calibrated scales with a digital receipt for every pickup." },
  { icon: Wallet, title: "Transparent rates", text: "Clear Bangalore scrap prices before pickup, with no surprise deductions at your doorstep." },
  { icon: Globe2, title: "Wide Bangalore coverage", text: "Doorstep scrap collection across apartments, homes, shops, and offices in major localities." },
  { icon: Leaf, title: "Responsible recycling", text: "Recovered scrap is routed to recycling partners instead of informal dumping." },
  { icon: BarChart3, title: "Bulk pickup support", text: "Businesses and apartments can request planned pickups for larger scrap volumes." },
  { icon: Recycle, title: "Household to e-waste", text: "Paper, plastic, metal, appliances, and e-waste handled through one simple booking flow." },
];

export const stats = [
  { value: "40+", label: "Bangalore areas" },
  { value: "12K+", label: "Pickups completed" },
  { value: "24 hr", label: "Pickup support" },
  { value: "4.9/5", label: "Pickup rating" },
];

export const testimonials = [
  {
    quote:
      "Booked a raddi and iron pickup from our HSR Layout apartment. The agent came in the selected slot, showed the weight clearly, and paid on the spot.",
    name: "Nikhil Rao",
    role: "Resident, HSR Layout",
  },
  {
    quote:
      "We had cardboard, old wires, and a broken appliance after shifting in Whitefield. ZAPIBOO handled everything in one visit without bargaining.",
    name: "Ananya Shetty",
    role: "Homeowner, Whitefield",
  },
  {
    quote:
      "Our shop near Indiranagar uses them for mixed scrap because the rate is told before pickup and the weighing is done in front of us.",
    name: "Faisal Ahmed",
    role: "Shop owner, Indiranagar",
  },
];

export const navLinks = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/materials", label: "Materials & Prices" },
  { to: "/listings", label: "Listings" },
  { to: "/areas", label: "Areas" },
  { to: "/business", label: "For Business" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

// Trimmed set shown in the site header (the rest live only in the footer).
export const headerNavLinks = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/materials", label: "Materials & Prices" },
  { to: "/listings", label: "Listings" },
  { to: "/areas", label: "Areas" },
  { to: "/contact", label: "Contact" },
] as const;
