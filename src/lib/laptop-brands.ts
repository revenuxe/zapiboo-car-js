// High-traffic SEO content for "sell used <brand> laptop in Bangalore" pages.
// Static content so every brand page renders fully server-side and is crawlable.

export type LaptopBrand = {
  slug: string; // matches the device_brands slug used by the sell funnel
  name: string; // brand label, e.g. "Dell"
  displayName: string; // marketing name, e.g. "Dell laptop"
  headline: string;
  h1?: string;
  tagline: string;
  intro: string[]; // paragraphs
  popularSeries: { name: string; note: string }[];
  models: string[];
  priceRange: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
};

const brandData: LaptopBrand[] = [
  {
    slug: "apple",
    name: "Apple MacBook",
    displayName: "Apple MacBook",
    headline: "Sell Your Used Apple MacBook in Bangalore",
    tagline: "Top cash for MacBook Air & MacBook Pro — Intel and M-series.",
    intro: [
      "Want to sell your old Apple MacBook in Bangalore? HuluMart pays the best resale price for every MacBook Air and MacBook Pro — from older Intel models to the latest M1, M2, M3 and M4 chips. Because MacBooks hold their value better than any other laptop, you get more cash back when you sell with us.",
      "Whether your MacBook is in mint condition, has a few dents, a battery that drains fast or even a cracked screen, we make a fair, transparent offer based on the live Bangalore resale market. Get a free instant quote, free doorstep pickup and same-day UPI payment — no lowball offers, no haggling.",
    ],
    popularSeries: [
      { name: "MacBook Air (M1/M2/M3)", note: "The most in-demand MacBook — fast quote, great resale value." },
      { name: "MacBook Air (Intel)", note: "13-inch Intel Airs still fetch strong prices." },
      { name: "MacBook Pro 13/14/16", note: "Pro models with M-series chips command premium buyback rates." },
      { name: "MacBook Pro (Intel)", note: "2016–2020 Intel Pros bought at fair market value." },
    ],
    models: [
      "MacBook Air M4",
      "MacBook Air M3",
      "MacBook Air M2",
      "MacBook Air M1",
      "MacBook Pro 14 M3/M4",
      "MacBook Pro 16 M3/M4",
      "MacBook Pro 13 M1/M2",
      "MacBook Pro Intel (2017–2020)",
    ],
    priceRange: "₹12,000 – ₹1,20,000+",
    keywords: [
      "sell used macbook bangalore",
      "sell old apple laptop bangalore",
      "macbook buyer bangalore",
      "second hand macbook price bangalore",
      "sell macbook pro for cash",
    ],
    faqs: [
      {
        q: "How much can I get for my used MacBook in Bangalore?",
        a: "MacBooks retain value very well. Depending on the model, chip, storage and condition, offers typically range from ₹12,000 for older Intel Airs to ₹1,20,000+ for recent MacBook Pro M-series. Get a free instant quote to see your exact price.",
      },
      {
        q: "Do you buy MacBooks with a cracked screen or battery issues?",
        a: "Yes. We buy MacBooks with cracked screens, swollen or weak batteries, keyboard faults and cosmetic damage. The price is adjusted fairly for the issue — you still get instant cash.",
      },
      {
        q: "Is my data safe when I sell my MacBook?",
        a: "Absolutely. We perform certified data wiping on every MacBook we collect, so your personal files, photos and iCloud data are permanently removed.",
      },
    ],
  },
  {
    slug: "dell",
    name: "Dell",
    displayName: "Dell laptop",
    headline: "Sell Your Used Dell Laptop in Bangalore",
    tagline: "Instant cash for Dell XPS, Inspiron, Latitude & Vostro.",
    intro: [
      "Looking to sell your old Dell laptop in Bangalore? HuluMart is the trusted buyer for every Dell series — XPS, Inspiron, Latitude, Vostro, G-series gaming and Alienware. Get the best resale price for your used Dell with a free instant quote, free doorstep pickup and instant payment.",
      "From slim XPS ultrabooks to everyday Inspiron and business-grade Latitude laptops, we buy them all — working perfectly or with minor issues like a weak battery, cracked screen or slow performance. Our valuation is benchmarked to the current Bangalore second-hand market, so you always get a fair deal.",
    ],
    popularSeries: [
      { name: "Dell XPS", note: "Premium ultrabooks — highest buyback value in the Dell range." },
      { name: "Dell Inspiron", note: "India's most popular Dell series for home and students." },
      { name: "Dell Latitude", note: "Business laptops with strong resale demand." },
      { name: "Dell G-series / Alienware", note: "Gaming laptops bought at premium rates." },
    ],
    models: [
      "Dell XPS 13 / 15 / 17",
      "Dell Inspiron 14 / 15 / 16",
      "Dell Latitude 5000 / 7000 series",
      "Dell Vostro 14 / 15",
      "Dell G15 / G16 Gaming",
      "Alienware m16 / m18",
    ],
    priceRange: "₹6,000 – ₹90,000+",
    keywords: [
      "sell used dell laptop bangalore",
      "sell old dell laptop bangalore",
      "dell laptop buyer bangalore",
      "second hand dell laptop price bangalore",
      "sell dell xps for cash",
    ],
    faqs: [
      {
        q: "How much is my used Dell laptop worth in Bangalore?",
        a: "It depends on the model, generation, RAM, SSD and condition. Inspiron and Vostro models typically fetch ₹6,000–₹30,000, while XPS and Alienware can go up to ₹90,000+. Get a free instant quote for your exact figure.",
      },
      {
        q: "Do you buy old or damaged Dell laptops?",
        a: "Yes. We buy Dell laptops that are a few years old or have issues like a cracked screen, weak battery, broken hinge or slow performance. The price reflects the condition, but you still get instant cash.",
      },
      {
        q: "How fast is the Dell laptop pickup?",
        a: "Same-day and next-day doorstep pickup slots are available across Bangalore. Our verified agent verifies your Dell and pays you instantly on the spot.",
      },
    ],
  },
  {
    slug: "hp",
    name: "HP",
    displayName: "HP laptop",
    headline: "Sell Your Used HP Laptop in Bangalore",
    tagline: "Best price for HP Pavilion, Envy, Victus, Omen & EliteBook.",
    intro: [
      "Sell your old HP laptop in Bangalore for instant cash with HuluMart. We buy every HP series — Pavilion, Envy, Victus, Omen gaming, EliteBook, ProBook and Spectre — at the best resale price, with a free instant quote and free doorstep pickup.",
      "Whether it's a budget Pavilion, a sleek Spectre convertible or a powerful Omen gaming rig, we make a transparent offer based on the live Bangalore market. Working laptops, ageing devices and units with cracked screens or battery problems are all welcome — you get fair value and same-day payment.",
    ],
    popularSeries: [
      { name: "HP Pavilion", note: "Best-selling HP series for students and families." },
      { name: "HP Envy / Spectre", note: "Premium and convertible laptops with high resale value." },
      { name: "HP Victus / Omen", note: "Gaming laptops bought at strong buyback rates." },
      { name: "HP EliteBook / ProBook", note: "Business laptops with reliable demand." },
    ],
    models: [
      "HP Pavilion 14 / 15",
      "HP Envy 13 / 14 / x360",
      "HP Spectre x360",
      "HP Victus 15 / 16",
      "HP Omen 15 / 16",
      "HP EliteBook / ProBook",
    ],
    priceRange: "₹5,000 – ₹80,000+",
    keywords: [
      "sell used hp laptop bangalore",
      "sell old hp laptop bangalore",
      "hp laptop buyer bangalore",
      "second hand hp laptop price bangalore",
      "sell hp pavilion for cash",
    ],
    faqs: [
      {
        q: "How much can I get for my used HP laptop in Bangalore?",
        a: "Pavilion and budget models generally fetch ₹5,000–₹25,000, while Envy, Spectre and Omen can reach ₹80,000+ depending on specs and condition. Use our free instant quote for an exact price.",
      },
      {
        q: "Do you buy HP laptops with problems?",
        a: "Yes. We buy HP laptops with cracked screens, battery issues, broken keyboards or slow performance. The offer is adjusted fairly and you get instant payment.",
      },
      {
        q: "Is HP laptop pickup free across Bangalore?",
        a: "Yes, doorstep pickup is completely free in every Bangalore locality. You only need to hand over the device to our verified agent.",
      },
    ],
  },
  {
    slug: "lenovo",
    name: "Lenovo",
    displayName: "Lenovo laptop",
    headline: "Sell Your Used Lenovo Laptop in Bangalore",
    tagline: "Instant cash for ThinkPad, IdeaPad, Legion, Yoga & LOQ.",
    intro: [
      "Sell your old Lenovo laptop in Bangalore with HuluMart and get the best resale price instantly. We buy every Lenovo series — ThinkPad, IdeaPad, Legion, Yoga, LOQ and ThinkBook — with a free instant quote, free doorstep pickup and same-day UPI payment.",
      "From rugged ThinkPad business machines to Legion and LOQ gaming laptops and flexible Yoga convertibles, we value them all against the current Bangalore second-hand market. Even laptops with a cracked screen, weak battery or minor faults are bought at a fair price.",
    ],
    popularSeries: [
      { name: "Lenovo ThinkPad", note: "Iconic business laptops with excellent resale value." },
      { name: "Lenovo IdeaPad", note: "Popular everyday series for home and students." },
      { name: "Lenovo Legion / LOQ", note: "Gaming laptops bought at premium buyback rates." },
      { name: "Lenovo Yoga", note: "2-in-1 convertibles with strong demand." },
    ],
    models: [
      "ThinkPad X1 Carbon / T-series",
      "IdeaPad Slim 3 / 5",
      "Legion 5 / 5 Pro / 7",
      "LOQ 15",
      "Yoga Slim / Yoga 7",
      "ThinkBook 14 / 15",
    ],
    priceRange: "₹5,000 – ₹95,000+",
    keywords: [
      "sell used lenovo laptop bangalore",
      "sell old lenovo laptop bangalore",
      "lenovo laptop buyer bangalore",
      "second hand lenovo laptop price bangalore",
      "sell thinkpad for cash",
    ],
    faqs: [
      {
        q: "How much is my used Lenovo laptop worth?",
        a: "IdeaPad and budget models typically fetch ₹5,000–₹28,000, while ThinkPad X1 and Legion gaming laptops can reach ₹95,000+. Get a free instant quote to see your exact price.",
      },
      {
        q: "Do you buy older or damaged Lenovo laptops?",
        a: "Yes. We buy Lenovo laptops with cracked screens, battery issues, hinge damage or slow performance. The price reflects the condition and you still get instant cash.",
      },
      {
        q: "How soon can I sell my Lenovo laptop?",
        a: "Same-day pickup slots are available across Bangalore. Our agent verifies your Lenovo at your doorstep and pays you instantly.",
      },
    ],
  },
  {
    slug: "asus",
    name: "Asus",
    displayName: "Asus laptop",
    headline: "Sell Your Used Asus Laptop in Bangalore",
    tagline: "Top cash for ROG, TUF, Zenbook & Vivobook.",
    intro: [
      "Sell your old Asus laptop in Bangalore for the best price with HuluMart. We buy every Asus series — ROG and TUF gaming laptops, Zenbook ultrabooks and Vivobook everyday laptops — with a free instant quote, free doorstep pickup and instant payment.",
      "Asus gaming laptops are in high demand on the Bangalore resale market, so you get excellent buyback value. Working laptops or units with a cracked screen, battery or performance issues are all bought at a fair, transparent price.",
    ],
    popularSeries: [
      { name: "Asus ROG", note: "Flagship gaming laptops — highest buyback value." },
      { name: "Asus TUF Gaming", note: "Popular value gaming series with strong demand." },
      { name: "Asus Zenbook", note: "Premium ultrabooks with great resale value." },
      { name: "Asus Vivobook", note: "Everyday laptops for home and students." },
    ],
    models: [
      "ROG Strix / Zephyrus",
      "TUF Gaming A15 / F15",
      "Zenbook 14 / Duo",
      "Vivobook 14 / 15 / 16",
      "ROG Flow",
      "Vivobook S series",
    ],
    priceRange: "₹5,000 – ₹1,00,000+",
    keywords: [
      "sell used asus laptop bangalore",
      "sell old asus laptop bangalore",
      "asus laptop buyer bangalore",
      "second hand asus laptop price bangalore",
      "sell asus rog for cash",
    ],
    faqs: [
      {
        q: "How much can I get for my used Asus laptop?",
        a: "Vivobook models generally fetch ₹5,000–₹30,000, while ROG and Zephyrus gaming laptops can reach ₹1,00,000+ depending on GPU, specs and condition. Get a free instant quote for the exact price.",
      },
      {
        q: "Do you buy Asus gaming laptops with issues?",
        a: "Yes. We buy Asus ROG, TUF and Zenbook laptops with cracked screens, battery problems or performance issues at a fair, condition-based price.",
      },
      {
        q: "Is Asus laptop pickup free in Bangalore?",
        a: "Yes, doorstep pickup is free across all Bangalore localities with same-day slots and instant payment.",
      },
    ],
  },
  {
    slug: "acer",
    name: "Acer",
    displayName: "Acer laptop",
    headline: "Sell Your Used Acer Laptop in Bangalore",
    tagline: "Best price for Aspire, Swift, Nitro & Predator.",
    intro: [
      "Sell your old Acer laptop in Bangalore with HuluMart and get instant cash. We buy every Acer series — Aspire, Swift, Nitro gaming and Predator — with a free instant quote, free doorstep pickup and same-day payment.",
      "From budget Aspire laptops to slim Swift ultrabooks and powerful Nitro and Predator gaming machines, we make a fair offer based on the live Bangalore resale market. Even laptops with minor faults or cosmetic damage are welcome.",
    ],
    popularSeries: [
      { name: "Acer Aspire", note: "Best-selling budget series for home and students." },
      { name: "Acer Swift", note: "Lightweight ultrabooks with good resale value." },
      { name: "Acer Nitro", note: "Popular value gaming laptops in strong demand." },
      { name: "Acer Predator", note: "High-end gaming laptops bought at premium rates." },
    ],
    models: [
      "Aspire 3 / 5 / 7",
      "Swift 3 / Go",
      "Nitro 5 / V15",
      "Predator Helios",
      "Aspire Lite",
      "Predator Triton",
    ],
    priceRange: "₹4,000 – ₹85,000+",
    keywords: [
      "sell used acer laptop bangalore",
      "sell old acer laptop bangalore",
      "acer laptop buyer bangalore",
      "second hand acer laptop price bangalore",
      "sell acer nitro for cash",
    ],
    faqs: [
      {
        q: "How much is my used Acer laptop worth in Bangalore?",
        a: "Aspire and Swift models typically fetch ₹4,000–₹28,000, while Nitro and Predator gaming laptops can reach ₹85,000+. Get a free instant quote for your exact price.",
      },
      {
        q: "Do you buy old Acer laptops with problems?",
        a: "Yes. We buy Acer laptops with cracked screens, battery issues or slow performance at a fair, condition-adjusted price with instant payment.",
      },
      {
        q: "How quickly can I sell my Acer laptop?",
        a: "Same-day doorstep pickup slots are available across Bangalore, with instant UPI payment after verification.",
      },
    ],
  },
  {
    slug: "msi",
    name: "MSI",
    displayName: "MSI laptop",
    headline: "Sell Your Used MSI Laptop in Bangalore",
    tagline: "Premium cash for MSI gaming & creator laptops.",
    intro: [
      "Sell your old MSI laptop in Bangalore for top cash with HuluMart. We buy every MSI series — Gaming (Katana, Stealth, Raider), Creator and Modern — with a free instant quote, free doorstep pickup and instant payment.",
      "MSI gaming and creator laptops are highly sought after on the Bangalore resale market, so you get premium buyback value. Working units or laptops with a cracked screen, battery or performance issues are all bought at a fair, transparent price.",
    ],
    popularSeries: [
      { name: "MSI Katana / Cyborg", note: "Popular value gaming laptops in high demand." },
      { name: "MSI Stealth / Raider", note: "Flagship gaming laptops — premium buyback rates." },
      { name: "MSI Creator", note: "Content-creation laptops with strong resale value." },
      { name: "MSI Modern", note: "Slim everyday laptops for work and study." },
    ],
    models: [
      "MSI Katana 15 / 17",
      "MSI Cyborg 15",
      "MSI Stealth 14 / 16",
      "MSI Raider GE",
      "MSI Creator Z / M",
      "MSI Modern 14 / 15",
    ],
    priceRange: "₹8,000 – ₹1,10,000+",
    keywords: [
      "sell used msi laptop bangalore",
      "sell old msi laptop bangalore",
      "msi laptop buyer bangalore",
      "second hand msi laptop price bangalore",
      "sell msi gaming laptop for cash",
    ],
    faqs: [
      {
        q: "How much can I get for my used MSI laptop?",
        a: "MSI Modern models typically fetch ₹8,000–₹35,000, while Stealth, Raider and Creator laptops can reach ₹1,10,000+ depending on GPU and condition. Get a free instant quote for your exact figure.",
      },
      {
        q: "Do you buy MSI gaming laptops with issues?",
        a: "Yes. We buy MSI gaming and creator laptops with cracked screens, battery problems or performance faults at a fair, condition-based price with instant cash.",
      },
      {
        q: "Is MSI laptop pickup free in Bangalore?",
        a: "Yes, doorstep pickup is completely free across Bangalore with same-day slots and instant payment after verification.",
      },
    ],
  },
];

export const laptopBrands = brandData;

export function getLaptopBrandBySlug(slug: string) {
  return brandData.find((b) => b.slug === slug);
}

export function modelSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getLaptopModel(brandSlug: string, modelSlugParam: string) {
  const brand = getLaptopBrandBySlug(brandSlug);
  if (!brand) return null;
  const name = brand.models.find((m) => modelSlug(m) === modelSlugParam);
  if (!name) return null;
  return { brand, name };
}
