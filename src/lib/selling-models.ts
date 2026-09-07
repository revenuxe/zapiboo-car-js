export type ModelCategory = "car" | "bike" | "scooter";

export const sellingModels = [
  { category: "car", slug: "maruti-swift", name: "Maruti Suzuki Swift", shortName: "Maruti Swift" },
  { category: "car", slug: "hyundai-creta", name: "Hyundai Creta", shortName: "Hyundai Creta" },
  { category: "car", slug: "honda-city", name: "Honda City", shortName: "Honda City" },
  { category: "car", slug: "maruti-dzire", name: "Maruti Suzuki Dzire", shortName: "Maruti Dzire" },
  {
    category: "car",
    slug: "maruti-baleno",
    name: "Maruti Suzuki Baleno",
    shortName: "Maruti Baleno",
  },
  {
    category: "car",
    slug: "maruti-wagon-r",
    name: "Maruti Suzuki Wagon R",
    shortName: "Maruti Wagon R",
  },
  {
    category: "car",
    slug: "maruti-brezza",
    name: "Maruti Suzuki Brezza",
    shortName: "Maruti Brezza",
  },
  { category: "car", slug: "tata-nexon", name: "Tata Nexon", shortName: "Tata Nexon" },
  {
    category: "bike",
    slug: "royal-enfield-classic-350",
    name: "Royal Enfield Classic 350",
    shortName: "Royal Enfield Classic 350",
  },
  {
    category: "bike",
    slug: "hero-splendor-plus",
    name: "Hero Splendor Plus",
    shortName: "Hero Splendor Plus",
  },
  { category: "bike", slug: "bajaj-pulsar", name: "Bajaj Pulsar", shortName: "Bajaj Pulsar" },
  { category: "scooter", slug: "honda-activa", name: "Honda Activa", shortName: "Honda Activa" },
  { category: "scooter", slug: "tvs-jupiter", name: "TVS Jupiter", shortName: "TVS Jupiter" },
  {
    category: "scooter",
    slug: "suzuki-access-125",
    name: "Suzuki Access 125",
    shortName: "Suzuki Access 125",
  },
] as const;

export type SellingModel = (typeof sellingModels)[number];
export type ModelSlug = SellingModel["slug"];
export const modelPath = (model: SellingModel) => `/sell-used-${model.category}/${model.slug}`;
export function findSellingModel(category: ModelCategory, slug: string) {
  return sellingModels.find((model) => model.category === category && model.slug === slug);
}
