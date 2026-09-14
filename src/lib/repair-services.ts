export const repairCategories = [
  {
    id: "bike-scooter",
    label: "Bike & Scooter",
    icon: "bike",
    compatibility:
      "Petrol bikes and scooters. Model, engine capacity and drivetrain determine which checks apply; chain work applies only to chain-driven vehicles.",
  },
  {
    id: "car",
    label: "Car",
    icon: "car",
    compatibility:
      "Petrol and diesel passenger cars, including SUVs. Confirm your model, fuel type and engine capacity with the team. Choose EV for electric vehicles.",
  },
  {
    id: "ev",
    label: "EV",
    icon: "ev",
    compatibility:
      "Electric two-wheelers and cars, subject to model and diagnostic support. Confirm your make and model before booking. Battery replacement and complex high-voltage repairs are not included.",
  },
] as const;

export type RepairCategory = (typeof repairCategories)[number]["id"];
export type ServiceIcon =
  | "wrench"
  | "inspection"
  | "oil"
  | "brakes"
  | "chain"
  | "battery"
  | "ac"
  | "charging"
  | "suspension"
  | "electrical";
export type RepairService = {
  vehicleCategory: RepairCategory;
  serviceName: string;
  slug: string;
  description: string;
  startingPrice: number;
  badge?: string;
  highlights: readonly string[];
  icon: ServiceIcon;
  cta: string;
  landingPageUrl: string;
};

type ServiceInput = Omit<RepairService, "cta" | "landingPageUrl">;
const packages: ServiceInput[] = [
  {
    vehicleCategory: "bike-scooter",
    serviceName: "General Service",
    slug: "bike-general-service",
    description: "Routine maintenance to keep your bike or scooter smooth, safe and road-ready.",
    startingPrice: 599,
    badge: "Most Popular",
    highlights: ["15+ point check", "Brake & chain check", "Bike wash"],
    icon: "wrench",
  },
  {
    vehicleCategory: "bike-scooter",
    serviceName: "Comprehensive Service",
    slug: "bike-comprehensive-service",
    description: "A deeper service for bikes and scooters that need more than routine maintenance.",
    startingPrice: 999,
    highlights: [
      "Full vehicle inspection",
      "Engine oil service",
      "Brake, clutch & suspension check",
    ],
    icon: "inspection",
  },
  {
    vehicleCategory: "bike-scooter",
    serviceName: "Oil Change",
    slug: "bike-oil-change",
    description: "Fresh engine oil and essential checks for smoother engine performance.",
    startingPrice: 399,
    highlights: ["Engine oil service", "Oil level check", "Leakage inspection"],
    icon: "oil",
  },
  {
    vehicleCategory: "bike-scooter",
    serviceName: "Brake Service",
    slug: "bike-brake-service",
    description: "Inspect, clean and adjust your braking system for safer rides.",
    startingPrice: 299,
    highlights: ["Brake inspection", "Cleaning & adjustment", "Brake performance check"],
    icon: "brakes",
  },
  {
    vehicleCategory: "bike-scooter",
    serviceName: "Chain & Sprocket",
    slug: "bike-chain-sprocket",
    description: "Keep your drivetrain clean, lubricated and properly adjusted.",
    startingPrice: 299,
    highlights: ["Chain cleaning", "Lubrication", "Tension check"],
    icon: "chain",
  },
  {
    vehicleCategory: "bike-scooter",
    serviceName: "Battery Service",
    slug: "bike-battery-service",
    description: "Check your battery and charging system before a small issue becomes a breakdown.",
    startingPrice: 199,
    highlights: ["Battery health check", "Voltage check", "Electrical inspection"],
    icon: "battery",
  },
  {
    vehicleCategory: "car",
    serviceName: "Car Basic Service",
    slug: "car-basic-service",
    description: "Essential maintenance and checks for your everyday drive.",
    startingPrice: 1499,
    highlights: ["Fluid level checks", "Brake inspection", "Basic safety checks"],
    icon: "wrench",
  },
  {
    vehicleCategory: "car",
    serviceName: "Car Standard Service",
    slug: "car-standard-service",
    description: "Routine care with a closer look at your car’s essential systems.",
    startingPrice: 2499,
    badge: "Most Popular",
    highlights: ["Engine oil service", "Filter inspection", "Brake & battery checks"],
    icon: "inspection",
  },
  {
    vehicleCategory: "car",
    serviceName: "Car Comprehensive Service",
    slug: "car-comprehensive-service",
    description: "A more thorough inspection for a clearer picture of your car’s condition.",
    startingPrice: 2999,
    highlights: ["Full vehicle inspection", "Engine oil service", "Clutch & suspension checks"],
    icon: "inspection",
  },
  {
    vehicleCategory: "car",
    serviceName: "Car AC Service",
    slug: "car-ac-service",
    description: "Investigate weak cooling, unusual smells and airflow concerns.",
    startingPrice: 699,
    highlights: ["Cooling performance check", "Vent & filter inspection", "Leak inspection"],
    icon: "ac",
  },
  {
    vehicleCategory: "car",
    serviceName: "Car Brake Service",
    slug: "car-brake-service",
    description: "Give your braking system the attention it needs for daily driving.",
    startingPrice: 499,
    highlights: ["Pad & disc inspection", "Cleaning & adjustment", "Brake performance check"],
    icon: "brakes",
  },
  {
    vehicleCategory: "car",
    serviceName: "Car Battery Service",
    slug: "car-battery-service",
    description: "Understand starting problems and your battery’s condition.",
    startingPrice: 399,
    highlights: ["Battery health check", "Charging system check", "Terminal inspection"],
    icon: "battery",
  },
  {
    vehicleCategory: "ev",
    serviceName: "EV Health Check",
    slug: "ev-health-check",
    description: "Essential checks to understand how your electric vehicle is performing.",
    startingPrice: 299,
    highlights: ["Vehicle health inspection", "Dashboard alert review", "Brake & tyre checks"],
    icon: "inspection",
  },
  {
    vehicleCategory: "ev",
    serviceName: "EV Battery Diagnostics",
    slug: "ev-battery-diagnostics",
    description: "Explore battery alerts and range concerns with model-specific diagnostics.",
    startingPrice: 499,
    highlights: ["Battery status review", "Fault code check", "Range concern assessment"],
    icon: "battery",
  },
  {
    vehicleCategory: "ev",
    serviceName: "Charging System Check",
    slug: "ev-charging-system",
    description: "Find the next step for charging interruptions or connection issues.",
    startingPrice: 399,
    highlights: ["Charging port inspection", "Connector condition check", "Charging fault review"],
    icon: "charging",
  },
  {
    vehicleCategory: "ev",
    serviceName: "EV Brake Service",
    slug: "ev-brake-service",
    description: "Inspect your EV’s mechanical brakes and discuss any braking concerns.",
    startingPrice: 299,
    highlights: ["Brake wear inspection", "Cleaning & adjustment", "Brake performance check"],
    icon: "brakes",
  },
  {
    vehicleCategory: "ev",
    serviceName: "EV Suspension Service",
    slug: "ev-suspension-service",
    description: "Investigate an uncomfortable ride, unusual noises or handling concerns.",
    startingPrice: 399,
    highlights: ["Suspension inspection", "Wear & leakage checks", "Ride concern assessment"],
    icon: "suspension",
  },
  {
    vehicleCategory: "ev",
    serviceName: "EV Electrical Diagnostics",
    slug: "ev-electrical-diagnostics",
    description: "Review electrical warnings and faults with compatible diagnostic tools.",
    startingPrice: 499,
    highlights: ["Fault code review", "Visible wiring inspection", "Electrical function checks"],
    icon: "electrical",
  },
];

export const repairServices: RepairService[] = packages.map((service) => ({
  ...service,
  cta: "View Service",
  landingPageUrl: `/repair/services/${service.slug}`,
}));
export const repairPriceDisclaimer =
  "*Prices are starting prices. Final pricing may vary based on your vehicle model, engine capacity, condition and parts required. No additional work will be carried out without your approval.";
export const formatRepairPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
export const getRepairService = (slug: string) =>
  repairServices.find((service) => service.slug === slug);
