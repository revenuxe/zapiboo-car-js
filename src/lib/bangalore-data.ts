import {
  Bike,
  Truck,
  Caravan,
  Newspaper,
  Package,
  Recycle,
  Wine,
  Cog,
  Cpu,
  Refrigerator,
  Boxes,
  Car,
} from "lucide-react";

/* ---------------- Bangalore service area ---------------- */

export type Locality = { name: string; pincode: string };

// Localities we actively serve (used for the dropdown + pincode check).
export const serviceLocalities: Locality[] = [
  { name: "HBR Layout", pincode: "560043" },
  { name: "Nagawara", pincode: "560045" },
  { name: "Koramangala", pincode: "560034" },
  { name: "Indiranagar", pincode: "560038" },
  { name: "HSR Layout", pincode: "560102" },
  { name: "Whitefield", pincode: "560066" },
  { name: "Marathahalli", pincode: "560037" },
  { name: "BTM Layout", pincode: "560076" },
  { name: "Jayanagar", pincode: "560011" },
  { name: "JP Nagar", pincode: "560078" },
  { name: "Electronic City", pincode: "560100" },
  { name: "Bellandur", pincode: "560103" },
  { name: "Sarjapur Road", pincode: "560035" },
  { name: "Banashankari", pincode: "560070" },
  { name: "Rajajinagar", pincode: "560010" },
  { name: "Malleshwaram", pincode: "560003" },
  { name: "Hebbal", pincode: "560024" },
  { name: "Yelahanka", pincode: "560064" },
  { name: "KR Puram", pincode: "560036" },
  { name: "Bommanahalli", pincode: "560068" },
  { name: "Kalyan Nagar", pincode: "560043" },
  { name: "Banaswadi", pincode: "560043" },
  { name: "RT Nagar", pincode: "560032" },
  { name: "Sahakar Nagar", pincode: "560092" },
  { name: "Jakkur", pincode: "560064" },
  { name: "Kothanur", pincode: "560077" },
  { name: "Thanisandra", pincode: "560077" },
  { name: "Horamavu", pincode: "560043" },
  { name: "Ramamurthy Nagar", pincode: "560016" },
  { name: "Mahadevapura", pincode: "560048" },
  { name: "Brookefield", pincode: "560037" },
  { name: "Kundalahalli", pincode: "560037" },
  { name: "Kadugodi", pincode: "560067" },
  { name: "Domlur", pincode: "560071" },
  { name: "Cox Town", pincode: "560005" },
  { name: "Frazer Town", pincode: "560005" },
  { name: "Basavanagudi", pincode: "560004" },
  { name: "Vijayanagar", pincode: "560040" },
  { name: "Yeshwanthpur", pincode: "560022" },
  { name: "Peenya", pincode: "560058" },
  { name: "Hennur", pincode: "560043" },
  { name: "Kammanahalli", pincode: "560084" },
  { name: "Manyata Tech Park", pincode: "560045" },
];

export const serviceablePincodes = new Set(serviceLocalities.map((l) => l.pincode));

export function isPincodeServiceable(pincode: string) {
  return serviceablePincodes.has(pincode.trim());
}

/* ---------------- Size tiers (instead of weight) ---------------- */

export type SizeTier = {
  id: string;
  label: string;
  hint: string;
};

export const sizeTiers: SizeTier[] = [
  { id: "small", label: "1–2 bags", hint: "A couple of bags or a small box" },
  { id: "medium", label: "3–5 bags", hint: "A few bags — typical monthly clear-out" },
  { id: "large", label: "A lot / room clear-out", hint: "Big haul, shifting house, or renovation" },
];

/* ---------------- What we take from homes (quick chips) ---------------- */

export type HouseholdType = {
  id: string;
  name: string;
  icon: typeof Newspaper;
};

export const householdTypes: HouseholdType[] = [
  { id: "raddi", name: "Newspaper / Raddi", icon: Newspaper },
  { id: "cardboard", name: "Cardboard & Books", icon: Package },
  { id: "plastic", name: "Plastic & Bottles", icon: Recycle },
  { id: "glass", name: "Glass Bottles", icon: Wine },
  { id: "metal", name: "Iron & Metal", icon: Cog },
  { id: "ewaste", name: "E-Waste", icon: Cpu },
  { id: "appliances", name: "Old Appliances", icon: Refrigerator },
  { id: "mixed", name: "Other / Mixed", icon: Boxes },
];

/* ---------------- Household rates in INR (₹) ---------------- */

export type HouseholdRate = {
  name: string;
  price: string;
  unit: string;
  note?: string;
};

export const householdRates: HouseholdRate[] = [
  { name: "Newspaper / Raddi", price: "₹15", unit: "/ kg" },
  { name: "Books & Magazines", price: "₹12", unit: "/ kg" },
  { name: "Cardboard (OCC)", price: "₹8", unit: "/ kg" },
  { name: "Mixed Plastic", price: "₹10", unit: "/ kg" },
  { name: "PET Bottles", price: "₹12", unit: "/ kg" },
  { name: "Glass Bottles", price: "₹2", unit: "/ kg" },
  { name: "Iron & Steel", price: "₹28", unit: "/ kg" },
  { name: "Aluminium", price: "₹105", unit: "/ kg" },
  { name: "Copper", price: "₹520", unit: "/ kg" },
  { name: "Brass", price: "₹330", unit: "/ kg" },
  { name: "E-Waste", price: "₹35", unit: "/ kg" },
  { name: "Old Appliances", price: "Quoted", unit: "/ piece", note: "Fridge, AC, washing machine, etc." },
];


/* ---------------- Vehicle categories for the booking flow ---------------- */

export type VehicleCategory = {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  icon: typeof Car;
  subcategories: string[];
};

export const vehicleCategories: VehicleCategory[] = [
  {
    id: "car",
    name: "Car",
    tagline: "Hatchback, sedan, SUV — petrol, diesel, CNG or electric.",
    badge: "Most sold",
    icon: Car,
    subcategories: [
      "Hatchback",
      "Sedan",
      "Compact SUV",
      "SUV / MUV",
      "Luxury car",
      "Electric car",
      "CNG car",
      "Vintage / classic",
    ],
  },
  {
    id: "bike",
    name: "Bike",
    tagline: "Commuter, sports and cruiser motorcycles of every engine size.",
    icon: Bike,
    subcategories: [
      "Commuter (100–125cc)",
      "150–250cc",
      "Sports bike",
      "Cruiser",
      "Adventure / tourer",
      "Electric bike",
      "Classic / retro",
    ],
  },
  {
    id: "scooter",
    name: "Scooter",
    tagline: "Petrol and electric scooters, mopeds and city runabouts.",
    icon: Caravan,
    subcategories: [
      "110cc scooter",
      "125cc scooter",
      "Maxi scooter",
      "Electric scooter",
      "Moped",
    ],
  },
  {
    id: "commercial",
    name: "Commercial vehicle",
    tagline: "Auto rickshaws, pickups, tempos and small trucks.",
    icon: Truck,
    subcategories: [
      "Auto rickshaw",
      "Mini truck / pickup",
      "Tempo traveller",
      "Goods carrier",
      "Taxi / fleet car",
    ],
  },
];

export function vehicleCategoryById(id: string) {
  return vehicleCategories.find((c) => c.id === id);
}
