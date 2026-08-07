import type { Block, BlogPost, HowTo } from "@/lib/blog";
import { serviceAreas } from "@/lib/seo";

const AUTHOR = { name: "Hari Prasad", role: "Buyback lead, HuluMart Bangalore" };

type AreaSeed = {
  slug: string;
  /** One-line positioning for the area — what makes selling here different. */
  angle: string;
  /** Local landmarks / micro-markets we quote around. */
  landmarks: string[];
  /** The device mix we actually see in this pincode. */
  deviceMix: string;
  /** Pickup logistics reality for the area. */
  logistics: string;
  /** Two area-specific FAQ entries on top of the shared ones. */
  faqs: Array<{ question: string; answer: string }>;
};

const seeds: AreaSeed[] = [
  {
    slug: "hbr-layout",
    angle:
      "HBR Layout is our home ground — the HuluMart desk sits in 560043, so pickups here are usually the fastest slot on the board.",
    landmarks: ["HBR 1st to 5th Block", "Kalyan Nagar junction", "Hennur Main Road", "Banaswadi Ring Road"],
    deviceMix:
      "A high share of family laptops — Dell Inspiron, HP Pavilion, Lenovo IdeaPad — three to six years old, plus a steady stream of student MacBook Airs after semester breaks.",
    logistics:
      "Most HBR Layout addresses get a same-day slot, and evening pickups after 7pm are routine because the executive is already in the neighbourhood.",
    faqs: [
      {
        question: "How fast can you pick up a laptop in HBR Layout?",
        answer:
          "Bookings confirmed before 4pm in 560043 are almost always collected the same evening, because our Bangalore desk operates out of HBR Layout itself.",
      },
      {
        question: "Do you cover all blocks of HBR Layout and HRBR Layout?",
        answer:
          "Yes — all five HBR blocks, HRBR 1st to 3rd Block, and the adjoining Kalyan Nagar, Banaswadi and Hennur stretches are on the same slot grid.",
      },
    ],
  },
  {
    slug: "whitefield",
    angle:
      "Whitefield sells the largest volume of work-issued and ex-corporate laptops in the city, so quotes here hinge on ownership proof more than condition.",
    landmarks: ["ITPL", "Hope Farm", "Brookefield", "Kadugodi", "Varthur Road"],
    deviceMix:
      "ThinkPads, Latitudes and EliteBooks bought out from employers, plus gaming machines from the tech-park rental crowd and MacBook Pros from product teams.",
    logistics:
      "Gated communities on Varthur and Hope Farm need a gate pass, so we ask for the flat number and tower at booking to avoid a wasted trip.",
    faqs: [
      {
        question: "Can I sell an ex-company laptop bought out from my employer in Whitefield?",
        answer:
          "Yes, provided you have the buyout invoice or a no-objection email from the employer. Asset-tagged machines without that paperwork cannot be purchased.",
      },
      {
        question: "Do you pick up from apartment complexes near ITPL?",
        answer:
          "We do. Share the tower and flat number when booking so the executive can be pre-cleared at the gate, and the pickup finishes in under fifteen minutes.",
      },
    ],
  },
  {
    slug: "koramangala",
    angle:
      "Koramangala is a startup churn market — laptops here are typically one to three years old and command the strongest resale bands in Bangalore.",
    landmarks: ["1st to 8th Block", "Sony World Signal", "Jyoti Nivas", "Ejipura", "Jakkasandra"],
    deviceMix:
      "Newer MacBook Air M1/M2/M3, XPS and Zephyrus units from founders upgrading annually — often with box, bill and warranty intact.",
    logistics:
      "Co-working handovers at 3rd and 6th Block are common; the executive can meet you at reception rather than your desk.",
    faqs: [
      {
        question: "Can you pick up from a co-working space in Koramangala?",
        answer:
          "Yes. Book the slot with the co-working address and reception name — handover happens at the front desk and payment is released before you go back up.",
      },
      {
        question: "Does an in-warranty laptop fetch more in Koramangala?",
        answer:
          "Remaining warranty adds roughly ₹1,500 to ₹4,000 depending on the brand and months left, and a laptop with box and original invoice sits at the top of its band.",
      },
    ],
  },
  {
    slug: "hsr-layout",
    angle:
      "HSR Layout sellers are usually upgrading rather than exiting, so the timing of the sale matters more than the haggling.",
    landmarks: ["Sector 1 to 7", "Agara Lake", "27th Main", "Silk Board side"],
    deviceMix:
      "Mid-to-premium Windows ultrabooks and a large MacBook base, mostly two to four years old with light cosmetic wear.",
    logistics:
      "Sector 1, 2 and 7 addresses are quick; we schedule around the Silk Board peak so slots there run before 5pm or after 8pm.",
    faqs: [
      {
        question: "Should I sell before or after buying my new laptop in HSR Layout?",
        answer:
          "Sell within a week of your new machine arriving. Every extra month of idle age costs roughly 1.5% of the resale value, and an unused laptop does not hold price.",
      },
      {
        question: "Which HSR sectors do you cover?",
        answer:
          "All sectors 1 through 7 plus Agara, Somasundarapalya and the 27th Main stretch fall inside the 560102 pickup grid.",
      },
    ],
  },
  {
    slug: "indiranagar",
    angle:
      "Indiranagar has the oldest premium device base in the city — well-kept MacBooks and business laptops that beat their age band when the battery is healthy.",
    landmarks: ["100 Feet Road", "CMH Road", "Domlur", "Old Airport Road"],
    deviceMix:
      "MacBook Pro 13/14-inch, Surface devices and older but immaculately maintained ThinkPads.",
    logistics:
      "Parking is tight on 100 Feet Road, so residential doorstep slots run smoother than street handovers; we suggest a home or office address.",
    faqs: [
      {
        question: "Is a five-year-old MacBook still worth selling in Indiranagar?",
        answer:
          "Usually yes. A 2020-2021 MacBook in working condition with a healthy battery still clears ₹25,000 upwards, far above what a similarly aged Windows laptop returns.",
      },
      {
        question: "Can the pickup happen at my office on CMH Road?",
        answer:
          "Yes — office, home or reception, whichever suits. We only need someone authorised to hand over the device and receive the payment.",
      },
    ],
  },
  {
    slug: "electronic-city",
    angle:
      "Electronic City moves in waves — appraisal cycles and project rollovers create clusters of sellers, and Phase 1 and Phase 2 are treated as separate slot zones.",
    landmarks: ["Phase 1", "Phase 2", "Neeladri Nagar", "Hosa Road", "Bommasandra"],
    deviceMix:
      "Volume of three-to-five-year-old corporate Windows laptops, plus budget student machines from the surrounding PG belt.",
    logistics:
      "Elevated-expressway traffic means we bundle Phase 1 and Phase 2 slots; morning bookings are collected the same day, late-evening ones roll to next morning.",
    faqs: [
      {
        question: "Do you pick up from Electronic City Phase 2 and Neeladri Nagar?",
        answer:
          "Yes, both phases plus Neeladri Nagar, Hosa Road and Bommasandra are covered under the 560100 grid on the same pickup route.",
      },
      {
        question: "I have three old laptops from my team — can you collect together?",
        answer:
          "Multi-device pickups are welcome and quoted per device. Mention the count while booking so the executive carries enough time and paperwork for the slot.",
      },
    ],
  },
  {
    slug: "marathahalli",
    angle:
      "Marathahalli is the price-comparison capital — sellers here have usually already walked the local computer market, so we lead with the number, not the pitch.",
    landmarks: ["Marathahalli Bridge", "Kundalahalli", "Munnekollal", "AECS Layout", "HAL Road"],
    deviceMix:
      "Mainstream Dell, HP, Asus and Acer machines, plus a healthy gaming-laptop supply from the AECS Layout rental market.",
    logistics:
      "The bridge stretch is slow between 6pm and 9pm, so we push slots to earlier windows and confirm on WhatsApp before leaving.",
    faqs: [
      {
        question: "Will you beat a shop quote from Marathahalli market?",
        answer:
          "Share the shop's written quote at inspection. Our figure is transparent and itemised, and in most Marathahalli pickups it lands above a cash-only shop offer with a receipt to match.",
      },
      {
        question: "Do gaming laptops sell well in Marathahalli?",
        answer:
          "They do. RTX-series machines hold strong demand here, though heavy thermal wear and a swollen battery will still move the device down one condition band.",
      },
    ],
  },
  {
    slug: "jayanagar",
    angle:
      "Jayanagar is a family-household market — devices are older, gently used, and the sellers care most about a documented, safe handover.",
    landmarks: ["4th Block", "South End Circle", "Basavanagudi", "Jayanagar 9th Block"],
    deviceMix:
      "Five-to-eight-year-old home laptops, school and college machines, and the occasional pristine MacBook from a returning NRI household.",
    logistics:
      "Daytime slots work best here, and the executive walks the senior members of the household through the receipt before payment.",
    faqs: [
      {
        question: "My laptop is eight years old and slow — is it still sellable in Jayanagar?",
        answer:
          "Yes. Even a non-booting or very old machine has scrap-and-parts value, typically ₹1,000 to ₹4,000, and we quote it honestly instead of refusing pickup.",
      },
      {
        question: "Will you help wipe the data during the Jayanagar pickup?",
        answer:
          "The executive guides you through the factory reset before handover so your files never leave with the device, and the receipt records the wipe.",
      },
    ],
  },
  {
    slug: "hebbal",
    angle:
      "Hebbal and the Manyata belt see the highest share of relocation sales — people selling because they are moving, on a deadline.",
    landmarks: ["Manyata Tech Park", "Kempapura", "Sahakar Nagar", "RT Nagar", "Nagawara"],
    deviceMix:
      "A balanced mix of corporate Windows laptops from Manyata and premium personal MacBooks from the surrounding apartment clusters.",
    logistics:
      "Airport-road relocations often need a fixed-time slot; we lock a window rather than a range when you tell us your flight or move date.",
    faqs: [
      {
        question: "I am relocating in two days — can you guarantee a slot in Hebbal?",
        answer:
          "Tell us the deadline while booking and we lock a fixed-time window instead of a range, including early-morning slots for Manyata and Kempapura addresses.",
      },
      {
        question: "Do you cover Manyata Tech Park and Nagawara?",
        answer:
          "Yes — Manyata, Nagawara, Thanisandra and Sahakar Nagar are part of the same Hebbal pickup route.",
      },
    ],
  },
  {
    slug: "yelahanka",
    angle:
      "Yelahanka is a spread-out, largely residential market where a scheduled slot matters more than instant dispatch.",
    landmarks: ["Yelahanka New Town", "Jakkur", "Kogilu", "Sahakar Nagar", "Doddaballapur Road"],
    deviceMix:
      "Student and family laptops around the college belt, plus premium devices from the New Town apartment blocks.",
    logistics:
      "Distances here are long, so Yelahanka pickups run on a confirmed morning or evening window announced on WhatsApp the previous day.",
    faqs: [
      {
        question: "Is doorstep pickup free in Yelahanka even though it is far from the city?",
        answer:
          "Pickup is free across every Bangalore pincode we serve, Yelahanka and New Town included. There is no distance charge and no fee if you decline the final figure.",
      },
      {
        question: "Can a student sell a laptop without a company invoice?",
        answer:
          "Yes. A government photo ID in the seller's name is enough; the original purchase invoice helps the price but is not mandatory.",
      },
    ],
  },
];

const howTo: HowTo = {
  name: "How to sell a used laptop at your doorstep in Bangalore",
  description:
    "Book a free doorstep pickup, get the laptop inspected in front of you and receive instant cash or UPI before the device leaves your hands.",
  totalTime: "PT20M",
  steps: [
    {
      name: "Pick your laptop model online",
      text: "Choose the brand, series and model on HuluMart to see an indicative price band for your configuration.",
    },
    {
      name: "Book a free doorstep pickup slot",
      text: "Enter your Bangalore address and pincode and choose a slot. Pickup is free and there is no charge if you decline the final figure.",
    },
    {
      name: "Back up and wipe your data",
      text: "Copy out what you need, sign out of your accounts and run a factory reset before the executive arrives.",
    },
    {
      name: "Doorstep inspection in front of you",
      text: "The executive verifies the model and serial number, powers on the device, and checks the display, keyboard, ports, battery health and storage while you watch.",
    },
    {
      name: "Approve the final quote",
      text: "You see the confirmed figure after inspection and can accept or decline it at no cost.",
    },
    {
      name: "Take instant cash or UPI",
      text: "Payment is released by instant UPI or cash before the laptop leaves your hands, along with a receipt recording the model, serial number and amount.",
    },
  ],
};

function buildAreaPost(seed: AreaSeed): BlogPost | null {
  const area = serviceAreas.find((a) => a.slug === seed.slug);
  if (!area) return null;

  const name = area.name;
  const nearby = area.nearby.length ? area.nearby : ["nearby localities"];
  const title = `Sell Used Laptop in ${name}, Bangalore: Prices & Same-Day Doorstep Pickup`;
  const description = `Selling a used laptop in ${name} (${area.pincode})? See 2026 resale price bands, what the doorstep inspection checks, and how to get instant cash with free pickup across ${name} and ${nearby[0]}.`;

  const blocks: Block[] = [
    { type: "p", text: seed.angle },
    {
      type: "p",
      text: `This page is specific to ${name} and pincode ${area.pincode}. It covers what laptops actually sell for here, how the doorstep inspection runs, and how the payment reaches you before the device leaves your hands. If you already know your model, you can skip ahead and book a pickup slot.`,
    },
    {
      type: "callout",
      tone: "tip",
      title: `Pickup coverage in ${name}`,
      text: `We collect from ${seed.landmarks.join(", ")} and the adjoining ${nearby.join(", ")} stretches. Pickup is free, and there is no charge if you decline the final quote.`,
    },
    {
      type: "cta",
      title: `Book a free laptop pickup in ${name}`,
      text: `Free doorstep pickup across ${area.pincode} with instant UPI or cash on handover.`,
      to: "/pickup",
      label: "Book my pickup",
    },

    { type: "h2", id: "prices", text: `What used laptops sell for in ${name}` },
    {
      type: "p",
      text: `${seed.deviceMix} The bands below are what sellers in and around ${name} realistically received over the last few months for working devices with a charger.`,
    },
    {
      type: "table",
      caption: `Indicative 2026 resale bands for ${name}, Bangalore`,
      head: ["Device type", "Age", "Typical payout"],
      rows: [
        ["Budget Windows (i3 / Ryzen 3, 8GB)", "3-5 years", "₹6,000 - ₹13,000"],
        ["Mainstream Windows (i5 / Ryzen 5, 8-16GB SSD)", "2-4 years", "₹14,000 - ₹28,000"],
        ["Premium ultrabook (i7 / Ryzen 7, 16GB)", "1-3 years", "₹28,000 - ₹52,000"],
        ["Gaming laptop (RTX 30/40 series)", "1-3 years", "₹32,000 - ₹75,000"],
        ["MacBook Air M1 / M2", "2-4 years", "₹32,000 - ₹62,000"],
        ["MacBook Pro 14/16-inch (M2/M3)", "1-3 years", "₹75,000 - ₹1,40,000"],
      ],
    },
    {
      type: "p",
      text: "Treat these as bands, not promises. Battery health, screen condition, storage size and whether you still have the original charger decide where inside the band your device lands.",
    },

    { type: "h2", id: "inspection", text: "What the doorstep inspection checks" },
    {
      type: "p",
      text: `The executive who reaches your ${name} address runs the same checklist every time, in front of you, and explains anything that moves the figure.`,
    },
    {
      type: "ol",
      items: [
        "Model and serial number matched against what you selected online.",
        "Power-on test, boot to desktop and a look at the display for dead pixels, lines or backlight bleed.",
        "Keyboard, trackpad, hinges, ports and camera tested individually.",
        "Battery health and charge cycles read from the system report.",
        "Storage type and capacity, RAM and graphics confirmed against the listing.",
        "Cosmetic condition — dents, deep scratches and body cracks noted on the receipt.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Two things that change the quote most",
      text: "A swollen or sub-70% battery and a cracked or line-affected display each pull the device down a full condition band. Everything else is usually a smaller adjustment.",
    },

    { type: "h2", id: "how-it-works", text: `How the ${name} pickup works, step by step` },
    {
      type: "ol",
      items: [
        "Pick your brand, series and model online to see an indicative price band.",
        `Book a free slot with your ${name} address and pincode ${area.pincode}.`,
        "Back up your files, sign out of your accounts and run a factory reset.",
        "The executive inspects the laptop at your door while you watch.",
        "You approve the final figure — or decline at no cost.",
        "Instant UPI or cash is released before the laptop leaves your hands, with a receipt.",
      ],
    },
    { type: "p", text: seed.logistics },

    { type: "h2", id: "prepare", text: `Preparing your laptop before the ${name} slot` },
    {
      type: "ul",
      items: [
        "Back up documents, photos and browser passwords to cloud storage or an external drive.",
        "Sign out of Google, Microsoft and iCloud accounts, and turn off Find My / Activation Lock on a MacBook.",
        "Run a factory reset so no personal data leaves with the device.",
        "Keep the charger ready — a missing charger reduces the payout on every brand.",
        "Keep a government photo ID in the seller's name for the receipt.",
        "Wipe the body and screen; presentation genuinely affects the cosmetic grade.",
      ],
    },
    {
      type: "cta",
      title: `Get today's price for your laptop in ${name}`,
      text: "Select your model, book a slot and get paid at your door the same day.",
      to: "/sell/laptops",
      label: "Check my laptop price",
    },

    { type: "h2", id: "faq", text: `FAQs about selling a laptop in ${name}` },
    {
      type: "faq",
      items: [
        ...seed.faqs,
        {
          question: `Is doorstep pickup in ${name} really free?`,
          answer: `Yes. Pickup anywhere in ${name} and pincode ${area.pincode} is free, and if you decline the final figure after inspection there is no cancellation or visit charge.`,
        },
        {
          question: "When do I get paid?",
          answer:
            "Payment is released by instant UPI or cash at your door, before the laptop is handed over. You never ship the device and wait for money.",
        },
        {
          question: "What documents do I need?",
          answer:
            "A government photo ID in the seller's name. The original invoice or box is optional and helps the price, and an employer buyout invoice is required for an ex-company laptop.",
        },
        {
          question: `Do you also collect from ${nearby.join(", ")}?`,
          answer: `Yes — ${nearby.join(", ")} sit on the same ${name} pickup route, so slot availability is identical.`,
        },
      ],
    },
  ];

  return {
    slug: `sell-used-laptop-in-${area.slug}-bangalore`,
    title,
    cardTitle: `Sell Used Laptop in ${name}`,
    metaTitle: `Sell Used Laptop in ${name}, Bangalore - Best Price, Free Pickup`,
    description,
    excerpt: `Resale price bands, the doorstep inspection checklist and same-day free pickup for laptop sellers in ${name} (${area.pincode}) and nearby ${nearby[0]}.`,
    keywords: [
      `sell used laptop in ${name.toLowerCase()}`,
      `sell old laptop ${name.toLowerCase()} bangalore`,
      `laptop buyers in ${name.toLowerCase()}`,
      `second hand laptop ${name.toLowerCase()}`,
      `sell laptop for cash ${name.toLowerCase()}`,
      `laptop pickup ${area.pincode}`,
    ],
    cluster: "area",
    clusterLabel: `${name} area guide`,
    readMinutes: 7,
    datePublished: "2026-08-07",
    dateModified: "2026-08-07",
    author: AUTHOR,
    howTo,
    related: [
      "sell-used-laptop-in-bangalore",
      "sell-laptop-in-bangalore-instant-cash",
      "used-laptop-resale-value-calculation",
      "wipe-data-before-selling-laptop",
    ],
    areaSlug: area.slug,
  };
}

export const areaPosts: BlogPost[] = seeds
  .map(buildAreaPost)
  .filter((p): p is BlogPost => Boolean(p));

export const areaHowTo = howTo;

export function getAreaPostBySlug(areaSlug: string) {
  return areaPosts.find((post) => post.areaSlug === areaSlug);
}
