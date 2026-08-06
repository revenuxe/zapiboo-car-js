import { serviceAreas } from "@/lib/seo";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title: string; text: string; tone?: "tip" | "warn" }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "cta"; title: string; text: string; to: string; label: string }
  | { type: "faq"; items: Array<{ question: string; answer: string }> };

export type BlogPost = {
  slug: string;
  title: string;
  /** Short title used in cards and breadcrumbs. */
  cardTitle: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  keywords: string[];
  cluster: "pillar" | "pricing" | "safety" | "brand" | "guide";
  clusterLabel: string;
  readMinutes: number;
  datePublished: string;
  dateModified: string;
  author: { name: string; role: string };
  blocks: Block[];
  related: string[];
};

const AUTHOR = { name: "Hari Prasad", role: "Buyback lead, HuluMart Bangalore" };

const topAreas = serviceAreas.slice(0, 14);

/* ------------------------------------------------------------------ */
/* Pillar post                                                         */
/* ------------------------------------------------------------------ */

const pillar: BlogPost = {
  slug: "sell-used-laptop-in-bangalore",
  title: "Sell Used Laptop in Bangalore: The Complete 2026 Price & Pickup Guide",
  cardTitle: "Sell Used Laptop in Bangalore (2026 Guide)",
  metaTitle: "Sell Used Laptop in Bangalore - Best Price, Free Pickup (2026)",
  description:
    "How to sell a used laptop in Bangalore in 2026: real resale price ranges by brand, what buyers actually check, how to avoid lowball quotes, data-wipe steps and same-day doorstep pickup across the city.",
  excerpt:
    "Everything a Bangalore seller needs before handing over a laptop: how resale prices are really calculated, the six things a buyer inspects at your door, brand-wise price bands, and the paperwork that protects you.",
  keywords: [
    "sell used laptop in bangalore",
    "sell old laptop bangalore",
    "second hand laptop price bangalore",
    "laptop buyers in bangalore",
    "sell laptop for cash bangalore",
    "used laptop resale value india",
  ],
  cluster: "pillar",
  clusterLabel: "Pillar guide",
  readMinutes: 14,
  datePublished: "2026-01-14",
  dateModified: "2026-08-06",
  author: AUTHOR,
  related: [
    "used-laptop-resale-value-calculation",
    "wipe-data-before-selling-laptop",
    "sell-macbook-vs-windows-laptop-bangalore",
    "best-time-to-sell-your-laptop",
  ],
  blocks: [
    {
      type: "p",
      text: "Most people in Bangalore sell a laptop exactly once every four or five years, which means you are negotiating against someone who buys twenty of them before lunch. That asymmetry, not the condition of your device, is what usually costs you a few thousand rupees. This guide closes the gap: it explains how used-laptop pricing actually works in this city, what a doorstep inspector is really looking at, and how to walk away paid the same day without regret.",
    },
    {
      type: "p",
      text: "We have picked up laptops from Whitefield apartments at 9pm, from Koramangala co-working desks between two meetings, and from Yelahanka homes where the device belonged to a student moving abroad the next morning. The patterns below come from those pickups, not from a keyword tool.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "The 30-second version",
      text: "A clean, working, 3-year-old mainstream laptop in Bangalore typically fetches 25-40% of its original price. A MacBook of the same age holds 45-60%. Anything with a cracked screen, swollen battery or missing charger drops one full band. Get at least two quotes, insist on payment before the device leaves your hand, and wipe your data yourself.",
    },

    { type: "h2", id: "who-buys", text: "Who actually buys used laptops in Bangalore?" },
    {
      type: "p",
      text: "There are five distinct buyer types in the city, and each one values your laptop differently. Knowing which one you are talking to explains why quotes for the same machine can differ by 8,000 rupees.",
    },
    {
      type: "table",
      caption: "Bangalore used-laptop buyer types compared",
      head: ["Buyer type", "Typical payout", "Speed", "Risk to you"],
      rows: [
        ["Organised buyback service (HuluMart, Cashify)", "Fair market, fixed", "Same day", "Low - documented, paid on pickup"],
        ["Local computer shop (SP Road, Nagarathpete)", "Low to fair", "Same day", "Medium - cash only, no receipt"],
        ["Peer-to-peer (OLX, Quikr, WhatsApp groups)", "Highest on paper", "1-6 weeks", "High - no-shows, fake UPI screenshots"],
        ["Brand exchange offer", "Below market, as discount", "Instant", "Low, but locked to a new purchase"],
        ["Refurbishers / bulk lots", "Lowest per unit", "Same day", "Low, but they want volume"],
      ],
    },
    {
      type: "p",
      text: "Peer-to-peer looks attractive until you count the cost of it: three weeks of messages, four cancelled meetups, a stranger in your living room, and a payment method you cannot reverse. Most sellers who start on a classifieds app finish with a buyback service anyway - just 20 days later and at a lower price, because the laptop aged another month in the meantime.",
    },

    { type: "h2", id: "how-price-works", text: "How your resale price is actually calculated" },
    {
      type: "p",
      text: "Every serious buyer runs the same mental formula. It is not a secret, and once you see it you can predict your own quote within a few hundred rupees.",
    },
    {
      type: "ol",
      items: [
        "Start from the current street price of the same model, not the price you paid. If the model is discontinued, the nearest current equivalent sets the ceiling.",
        "Apply age depreciation - roughly 22-30% in year one, then 15-20% each following year for Windows laptops, and 12-15% for MacBooks.",
        "Adjust for configuration. RAM and SSD size move the number more than the processor generation on mainstream machines; a dedicated RTX GPU can add a whole band.",
        "Deduct for condition - screen, body, hinge, keyboard, battery health, and whether the original charger is present.",
        "Deduct for demand. A 2-in-1 with a touch screen sells slower in Bangalore than a plain 14-inch business laptop, so it is priced more conservatively.",
        "Subtract refurbishing and logistics cost, then quote.",
      ],
    },
    {
      type: "p",
      text: "Two identical-looking laptops can be 6,000 rupees apart because one has 16GB RAM and a 512GB SSD while the other has 8GB and 256GB. Before you accept any quote, know your exact configuration - it is the single highest-leverage number in the conversation.",
    },
    {
      type: "cta",
      title: "Check your model's live price",
      text: "Pick your brand, series and model and see what HuluMart pays for it in Bangalore today - no sign-up needed to look.",
      to: "/",
      label: "Get my laptop price",
    },

    { type: "h2", id: "brand-bands", text: "Brand-wise resale bands in Bangalore (2026)" },
    {
      type: "p",
      text: "These are the ranges we see most often for working laptops with no display damage, expressed as a share of the original invoice value. Treat them as a sanity check on any quote you receive, not as a promise.",
    },
    {
      type: "table",
      caption: "Typical share of original price retained, by brand and age",
      head: ["Brand", "1 year old", "3 years old", "5 years old"],
      rows: [
        ["Apple MacBook (M-series)", "70-80%", "48-60%", "30-40%"],
        ["Apple MacBook (Intel)", "55-65%", "32-42%", "18-25%"],
        ["Dell XPS / Latitude", "55-65%", "33-42%", "18-26%"],
        ["Lenovo ThinkPad", "52-62%", "32-40%", "18-25%"],
        ["HP Spectre / EliteBook", "50-60%", "30-38%", "16-24%"],
        ["Asus / Acer mainstream", "45-55%", "25-34%", "12-20%"],
        ["Gaming (RTX series)", "55-65%", "35-45%", "20-28%"],
      ],
    },
    {
      type: "p",
      text: "Two Bangalore-specific quirks are worth knowing. First, business-class machines - ThinkPad, Latitude, EliteBook - hold value better here than in most Indian cities because the IT services market absorbs them endlessly. Second, gaming laptops sell fastest between June and September, when college semesters start.",
    },

    { type: "h2", id: "inspection", text: "The six things an inspector checks at your door" },
    {
      type: "p",
      text: "A doorstep evaluation takes about 10 minutes. If you know the checklist, there are no surprises and no last-minute price cuts.",
    },
    {
      type: "ul",
      items: [
        "Display: dead pixels, backlight bleed, pressure marks and any hairline crack under the glass. This is the most expensive single fault.",
        "Battery health: cycle count and maximum capacity. Below 80% health usually triggers a deduction; a swollen battery that lifts the trackpad is a hard reset of the whole quote.",
        "Body and hinge: dents at the corners, a loose or stiff hinge, and whether the bottom panel screws are intact.",
        "Keyboard and trackpad: every key pressed, trackpad click on all four corners, backlight if the model has one.",
        "Ports and wireless: each USB and HDMI port, headphone jack, Wi-Fi and Bluetooth connection.",
        "Ownership and accessories: original charger, the box if you still have it, and proof that the device is not under an active finance or corporate asset lock.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Never let a laptop leave without payment",
      text: "A legitimate buyer pays before or at the moment of handover - UPI, bank transfer or cash in hand. 'We will transfer after quality check at the warehouse' is the single most common way sellers in Bangalore lose their device.",
    },

    { type: "h2", id: "prepare", text: "Prepare your laptop the night before (checklist)" },
    {
      type: "ol",
      items: [
        "Back up everything you care about to an external drive or cloud, then verify the backup opens.",
        "Sign out of iCloud, Google, Microsoft and any password manager, then remove the device from your account's trusted list.",
        "Turn off Find My Mac / Find My Device and disable the firmware or BIOS password - a locked device is unsellable and will be rejected on the spot.",
        "Perform a full factory reset with the drive-erase option (details in our data-wipe guide).",
        "Clean the screen and body with a microfibre cloth. It sounds cosmetic because it is - and it genuinely moves the condition grade.",
        "Keep the charger, and the box and bill if you have them. A matching charger is worth 800-2,500 rupees on the quote.",
      ],
    },

    { type: "h2", id: "pickup-areas", text: "Doorstep pickup across Bangalore" },
    {
      type: "p",
      text: `We run free doorstep pickups across ${serviceAreas.length}+ localities in Bangalore, usually within 24 hours of a confirmed quote and often the same day for central areas. Pick your locality below for area-specific pricing notes and slots.`,
    },
    {
      type: "ul",
      items: topAreas.map(
        (a) => `${a.name} (${a.pincode}) - same-day slots, evening pickups available`,
      ),
    },
    {
      type: "p",
      text: "If your pincode is not on the list, it is still worth checking - we add localities every month, and outer areas like Devanahalli, Anekal and Nelamangala are usually covered on scheduled routes.",
    },

    { type: "h2", id: "mistakes", text: "Seven mistakes that cost Bangalore sellers money" },
    {
      type: "ul",
      items: [
        "Quoting from the invoice price instead of today's street price - it anchors you to a number no buyer will meet.",
        "Selling without knowing the RAM and SSD size, and letting the buyer 'assume' the lower config.",
        "Waiting for a better offer for three months. Depreciation costs more than the difference you are holding out for.",
        "Accepting a quote that drops at the door for a fault that was visible in your own photos.",
        "Handing over the laptop before the money lands, or accepting a screenshot as proof of payment.",
        "Forgetting to remove the device from Find My / Microsoft account, which delays payment or cancels the deal.",
        "Throwing away the charger months ago and only discovering it at pickup.",
      ],
    },

    { type: "h2", id: "process", text: "What selling to HuluMart looks like end to end" },
    {
      type: "ol",
      items: [
        "Pick your brand, series and exact model on the site and see the price band for your configuration.",
        "Share condition details and a couple of photos over WhatsApp if you want an indicative confirmation before booking.",
        "Book a free pickup slot at your address - morning, afternoon or evening.",
        "Our executive verifies the device in front of you in about 10 minutes and confirms the final number.",
        "You get paid by UPI or bank transfer immediately, and receive a signed handover receipt by email.",
      ],
    },
    {
      type: "quote",
      text: "The part sellers value most is not the price - it is watching the money arrive before the laptop goes into the bag.",
      cite: AUTHOR.name + ", " + AUTHOR.role,
    },

    { type: "h2", id: "faq", text: "Frequently asked questions" },
    {
      type: "faq",
      items: [
        {
          question: "How much can I get for a used laptop in Bangalore?",
          answer:
            "Most working 3-year-old laptops fetch 25-40% of their original price, while MacBooks of the same age hold 45-60%. Exact payout depends on model, RAM, storage, battery health and screen condition. Checking your specific model gives a far tighter range than any general estimate.",
        },
        {
          question: "Do I need the original bill or box to sell my laptop?",
          answer:
            "No. A government photo ID is enough for the handover. The bill and box are helpful and can slightly improve the quote, but they are not mandatory for a resale.",
        },
        {
          question: "Is doorstep pickup really free in Bangalore?",
          answer:
            "Yes. Pickup, evaluation and payment processing are free across our Bangalore service areas. Nothing is deducted from the agreed price for logistics.",
        },
        {
          question: "How fast do I get paid?",
          answer:
            "Payment is made by UPI or bank transfer at the moment of handover, once the doorstep evaluation is complete and you accept the final quote. There is no waiting period.",
        },
        {
          question: "Will you buy a laptop with a cracked screen or dead battery?",
          answer:
            "Usually yes, at an adjusted price. Screen and battery replacement cost is deducted from the working-condition value. Devices that do not power on at all are evaluated case by case.",
        },
        {
          question: "Is my data safe after I hand over the laptop?",
          answer:
            "We recommend performing your own factory reset with a full drive erase before pickup, and our team will help if you have not done it. Every device we accept goes through a certified data-sanitisation pass before resale.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Cluster posts                                                       */
/* ------------------------------------------------------------------ */

const pricing: BlogPost = {
  slug: "used-laptop-resale-value-calculation",
  title: "How Used Laptop Resale Value Is Calculated in India (With Real Examples)",
  cardTitle: "How resale value is calculated",
  metaTitle: "Used Laptop Resale Value Calculator Logic - India 2026 | HuluMart",
  description:
    "The exact depreciation curve, configuration weightings and condition deductions buyers use to price a second-hand laptop in India - with three worked examples you can copy.",
  excerpt:
    "Depreciation curves, config weightings and condition deductions - worked through on three real Bangalore devices so you can price your own laptop before anyone quotes you.",
  keywords: [
    "used laptop resale value",
    "laptop depreciation india",
    "second hand laptop price calculator",
    "laptop exchange value",
  ],
  cluster: "pricing",
  clusterLabel: "Pricing",
  readMinutes: 8,
  datePublished: "2026-02-03",
  dateModified: "2026-08-06",
  author: AUTHOR,
  related: ["sell-used-laptop-in-bangalore", "best-time-to-sell-your-laptop", "sell-macbook-vs-windows-laptop-bangalore"],
  blocks: [
    {
      type: "p",
      text: "Resale pricing feels arbitrary from the seller's side and is almost mechanical from the buyer's side. This post shows the machinery: the curve, the weights, and the deductions - then applies it to three laptops we picked up in Bangalore this year.",
    },
    { type: "h2", id: "curve", text: "The depreciation curve" },
    {
      type: "p",
      text: "Laptops lose value fastest in the first twelve months, then settle into a steadier slide. The shape matters more than the exact percentages, because it tells you when holding on stops paying.",
    },
    {
      type: "table",
      caption: "Approximate value retained against original invoice price",
      head: ["Age", "Windows mainstream", "Windows premium/business", "MacBook"],
      rows: [
        ["6 months", "78-85%", "80-88%", "85-92%"],
        ["1 year", "62-72%", "68-76%", "72-82%"],
        ["2 years", "45-55%", "50-60%", "58-68%"],
        ["3 years", "30-40%", "36-46%", "45-58%"],
        ["4 years", "22-30%", "27-36%", "35-46%"],
        ["5 years", "14-22%", "18-27%", "26-38%"],
      ],
    },
    { type: "h2", id: "weights", text: "What configuration is worth" },
    {
      type: "ul",
      items: [
        "RAM: moving from 8GB to 16GB is typically worth 8-12% of the device value on a mainstream machine - more than one processor generation.",
        "Storage: 256GB to 512GB adds 5-8%; 1TB adds 10-14%. Mechanical hard drives now subtract value rather than add it.",
        "Processor: each generation is worth roughly 4-7%. A Core i5 of a newer generation often beats an older i7 in resale.",
        "Graphics: an entry dedicated GPU adds little; an RTX 40-series card can add 15-25% and widens the buyer pool sharply.",
        "Screen: a high-refresh or OLED panel adds 5-10%; a 1366x768 panel in 2026 subtracts.",
      ],
    },
    { type: "h2", id: "deductions", text: "Condition deductions that hurt most" },
    {
      type: "table",
      head: ["Issue", "Typical deduction"],
      rows: [
        ["Cracked or spotted display", "25-40% of value"],
        ["Battery health below 70% / swollen", "8-18%"],
        ["Loose or cracked hinge", "10-20%"],
        ["Dents, deep scratches, missing feet", "3-8%"],
        ["Missing original charger", "800-2,500 rupees flat"],
        ["Dead port, Wi-Fi or keyboard key", "5-12%"],
      ],
    },
    { type: "h2", id: "examples", text: "Three worked examples" },
    { type: "h3", text: "1. MacBook Air M1, 2021, 8GB/256GB, Koramangala" },
    {
      type: "p",
      text: "Original 92,900 rupees. Four and a half years old, battery at 84%, one small dent on the lid, charger present. Curve puts it at roughly 33% for M-series at this age, the dent takes 4%, giving a payout band in the high twenties of thousands. Sold at 28,500 rupees within the same day.",
    },
    { type: "h3", text: "2. Dell Inspiron 15, 2022, i5 11th gen, 8GB/512GB, Whitefield" },
    {
      type: "p",
      text: "Original 61,000 rupees. Three years old, perfect screen, 88% battery, charger present. Mainstream curve at 34%, plus 5% for the 512GB SSD, minus nothing for condition. Quoted 21,000 rupees, paid on pickup.",
    },
    { type: "h3", text: "3. Asus TUF Gaming A15, 2023, Ryzen 7, RTX 3050, HSR Layout" },
    {
      type: "p",
      text: "Original 78,000 rupees. Two years old, heavy use, fan noise, screen clean. Gaming curve at 44%, minus 6% for servicing the thermals. Quoted 29,500 rupees - gaming demand in the June intake season carried it.",
    },
    {
      type: "cta",
      title: "Run the numbers on your own laptop",
      text: "Select your exact model and configuration to see today's HuluMart price band in Bangalore.",
      to: "/",
      label: "Check my price",
    },
    { type: "h2", id: "faq", text: "FAQ" },
    {
      type: "faq",
      items: [
        {
          question: "Does upgrading RAM before selling increase the price?",
          answer:
            "Only if the upgrade is cheaper than the value it adds, which is rare. A 16GB stick usually costs more than the 8-12% it lifts the quote by on an older machine.",
        },
        {
          question: "Is it worth repairing a cracked screen before selling?",
          answer:
            "Sometimes. If the panel replacement quote is well below the 25-40% deduction the crack causes, repair first. On budget laptops the repair usually costs more than it recovers.",
        },
        {
          question: "Why do two buyers quote different prices for the same laptop?",
          answer:
            "Different resale channels. A buyer with retail demand for your exact model pays closer to market; a bulk refurbisher prices for the lowest common denominator.",
        },
      ],
    },
  ],
};

const safety: BlogPost = {
  slug: "wipe-data-before-selling-laptop",
  title: "How to Wipe Your Data Before Selling a Laptop (Windows & macOS)",
  cardTitle: "Wipe your data before selling",
  metaTitle: "Erase Data Before Selling a Laptop - Windows & Mac Steps | HuluMart",
  description:
    "Step-by-step factory reset and secure erase for Windows 11 and macOS, plus the account sign-outs and activation locks you must clear before selling a used laptop in India.",
  excerpt:
    "A factory reset alone is not always enough. Here is the exact sequence - sign-outs, activation lock, drive erase and verification - for Windows 11 and macOS.",
  keywords: [
    "wipe data before selling laptop",
    "factory reset laptop before selling",
    "erase macbook before selling",
    "remove activation lock macbook",
  ],
  cluster: "safety",
  clusterLabel: "Data & safety",
  readMinutes: 7,
  datePublished: "2026-03-11",
  dateModified: "2026-08-06",
  author: AUTHOR,
  related: ["sell-used-laptop-in-bangalore", "used-laptop-resale-value-calculation"],
  blocks: [
    {
      type: "p",
      text: "The riskiest moment in selling a laptop is not the payment - it is the browser session, the saved UPI card and the work files you forgot were in Downloads. Do this sequence the evening before pickup and there is nothing left to worry about.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Order matters",
      text: "Sign out of accounts and disable activation lock BEFORE you erase. A wiped device that is still linked to your Apple ID or Microsoft account is locked, unsellable, and painful to recover.",
    },
    { type: "h2", id: "before", text: "Step 1 - Back up and sign out" },
    {
      type: "ol",
      items: [
        "Copy documents, photos and project folders to an external drive or cloud, then open two or three files from the backup to confirm it worked.",
        "Export saved passwords from your browser or password manager, then sign out of the manager.",
        "Sign out of iCloud, Google, Microsoft, Adobe, Office and any licensed software so you can reuse the seat elsewhere.",
        "Deauthorise the device from streaming and licence lists (Apple Music, Adobe, JetBrains, Steam).",
      ],
    },
    { type: "h2", id: "macos", text: "Step 2a - macOS: erase all content and settings" },
    {
      type: "ol",
      items: [
        "System Settings > General > Transfer or Reset > Erase All Content and Settings.",
        "Sign out of Apple ID when prompted - this is what removes Activation Lock.",
        "Let it restart to the setup assistant and leave it there. Do not create a new account.",
        "Verify: hold the power button, boot to Recovery, and confirm the Mac asks for setup rather than your old login.",
      ],
    },
    { type: "h2", id: "windows", text: "Step 2b - Windows 11: reset with data cleaning" },
    {
      type: "ol",
      items: [
        "Settings > System > Recovery > Reset this PC > Remove everything.",
        "Choose Local reinstall, then Change settings and turn ON 'Clean data'. This overwrites the drive rather than just deleting the index.",
        "Confirm and let it run - a clean-data reset on an SSD takes 30-90 minutes.",
        "Disable the BIOS/UEFI supervisor password if you ever set one, and remove the device from account.microsoft.com > Devices.",
      ],
    },
    { type: "h2", id: "verify", text: "Step 3 - Verify before handover" },
    {
      type: "ul",
      items: [
        "The laptop boots to a fresh out-of-box setup screen with no personal name or email visible.",
        "No BIOS, firmware or fingerprint lock prompts appear.",
        "Find My / Find My Device shows the laptop removed from your account.",
        "The recycle bin, Downloads folder and browser profiles are gone with the reset.",
      ],
    },
    {
      type: "p",
      text: "If any of this feels risky to do alone, our pickup executive can walk through the reset with you at your door before the device is handed over, and every laptop we accept goes through a certified sanitisation pass before it is resold.",
    },
    {
      type: "cta",
      title: "Ready to sell safely?",
      text: "Book a free doorstep pickup in Bangalore - reset help included, payment before handover.",
      to: "/",
      label: "Book free pickup",
    },
    { type: "h2", id: "faq", text: "FAQ" },
    {
      type: "faq",
      items: [
        {
          question: "Is a factory reset enough to protect my data on an SSD?",
          answer:
            "On modern SSDs with encryption enabled (BitLocker or FileVault), a factory reset that discards the encryption key makes the old data unrecoverable. Adding the 'Clean data' option on Windows gives an extra overwrite pass.",
        },
        {
          question: "What if I forgot my Apple ID password?",
          answer:
            "Recover it at iforgot.apple.com before pickup. A MacBook with Activation Lock still enabled cannot be resold and most buyers will decline it.",
        },
        {
          question: "Should I remove the SSD instead?",
          answer:
            "You can, but the missing drive reduces the quote by more than a new drive costs. A verified wipe gets you a better price with the same peace of mind.",
        },
      ],
    },
  ],
};

const brand: BlogPost = {
  slug: "sell-macbook-vs-windows-laptop-bangalore",
  title: "Selling a MacBook vs a Windows Laptop in Bangalore: What Changes",
  cardTitle: "MacBook vs Windows resale",
  metaTitle: "Sell MacBook or Windows Laptop in Bangalore - Price Difference | HuluMart",
  description:
    "Why MacBooks hold 15-20 points more resale value than Windows laptops in Bangalore, which Windows models are the exception, and how the selling process differs for each.",
  excerpt:
    "Resale curves, buyer demand and handover steps differ sharply between macOS and Windows machines. Here is what that means for your payout in Bangalore.",
  keywords: [
    "sell macbook bangalore",
    "macbook resale value india",
    "sell windows laptop bangalore",
    "macbook vs windows resale",
  ],
  cluster: "brand",
  clusterLabel: "Brand insight",
  readMinutes: 6,
  datePublished: "2026-04-22",
  dateModified: "2026-08-06",
  author: AUTHOR,
  related: ["sell-used-laptop-in-bangalore", "used-laptop-resale-value-calculation", "best-time-to-sell-your-laptop"],
  blocks: [
    {
      type: "p",
      text: "Ask any Bangalore buyback desk which device they price fastest and the answer is a MacBook. Narrow model range, predictable configurations and a deep resale market make it almost a commodity. Windows laptops are the opposite - hundreds of SKUs, wildly different configurations behind the same name.",
    },
    { type: "h2", id: "gap", text: "Why the resale gap exists" },
    {
      type: "ul",
      items: [
        "Model discipline: Apple sells a handful of models a year, so a used MacBook Air M2 is instantly comparable across the market.",
        "Software life: macOS supports devices for seven-plus years, which keeps five-year-old MacBooks genuinely usable.",
        "Build consistency: aluminium bodies age visibly better than plastic-bodied mainstream Windows machines.",
        "Buyer demand: Bangalore's design, startup and student market actively hunts second-hand MacBooks under 40,000 rupees.",
      ],
    },
    { type: "h2", id: "windows-exceptions", text: "The Windows models that beat the curve" },
    {
      type: "p",
      text: "Not every Windows laptop depreciates hard. Business-class and gaming machines behave much closer to MacBooks in this city.",
    },
    {
      type: "table",
      head: ["Model family", "Why it holds value"],
      rows: [
        ["Lenovo ThinkPad T / X series", "Endless corporate and IT-services demand, easy parts availability"],
        ["Dell Latitude / XPS", "Enterprise refresh cycles keep the resale market liquid"],
        ["HP EliteBook", "Same corporate demand, strong keyboard reputation"],
        ["Asus ROG / TUF, MSI gaming", "Student and cafe demand peaks around semester intake"],
        ["Microsoft Surface Laptop", "Small supply, steady premium buyer interest"],
      ],
    },
    { type: "h2", id: "process", text: "Handover differences" },
    {
      type: "ol",
      items: [
        "MacBook: Activation Lock must be off and Apple ID signed out. Battery cycle count is read directly and matters more than on Windows.",
        "MacBook: keyboard generation matters - butterfly-keyboard models are priced more cautiously than the newer scissor design.",
        "Windows: exact RAM and SSD are verified on device because the same model name covers many configurations.",
        "Windows: any corporate asset tag, domain join or BIOS supervisor password must be cleared, or the sale cannot proceed.",
      ],
    },
    {
      type: "cta",
      title: "See your brand's price band",
      text: "Apple, Dell, HP, Lenovo, Asus, Acer, MSI - pick a brand and model for today's Bangalore quote.",
      to: "/",
      label: "Choose my brand",
    },
    { type: "h2", id: "faq", text: "FAQ" },
    {
      type: "faq",
      items: [
        {
          question: "Do Intel MacBooks still sell well in Bangalore?",
          answer:
            "They sell, but the gap with M-series is wide. An Intel MacBook of the same age typically fetches 15-20 percentage points less of its original value than an M1 or M2 machine.",
        },
        {
          question: "Does AppleCare transfer to the buyer?",
          answer:
            "Remaining AppleCare coverage does transfer with the device in India and can modestly improve your quote. Mention it before evaluation.",
        },
        {
          question: "Is a gaming laptop harder to sell?",
          answer:
            "Not in Bangalore, especially between June and September. Thermals and fan condition matter more than on other machines, so a recent service helps.",
        },
      ],
    },
  ],
};

const timing: BlogPost = {
  slug: "best-time-to-sell-your-laptop",
  title: "When Is the Best Time to Sell Your Laptop? A Depreciation-Based Answer",
  cardTitle: "Best time to sell your laptop",
  metaTitle: "Best Time to Sell a Used Laptop in India - Timing Guide | HuluMart",
  description:
    "The month, the model year and the life stage at which selling a used laptop returns the most money in India - and the three signals that mean you already waited too long.",
  excerpt:
    "Depreciation, launch cycles and Bangalore's own seasonal demand decide how much your laptop is worth this month versus next quarter.",
  keywords: [
    "best time to sell laptop",
    "when to sell old laptop",
    "laptop depreciation timing",
    "sell laptop before new launch",
  ],
  cluster: "guide",
  clusterLabel: "Strategy",
  readMinutes: 6,
  datePublished: "2026-05-19",
  dateModified: "2026-08-06",
  author: AUTHOR,
  related: ["sell-used-laptop-in-bangalore", "used-laptop-resale-value-calculation", "wipe-data-before-selling-laptop"],
  blocks: [
    {
      type: "p",
      text: "The honest answer to 'when should I sell?' is: earlier than you think, and definitely before the next generation of your model launches. Value leaks quietly every month a laptop sits in a cupboard.",
    },
    { type: "h2", id: "cost-of-waiting", text: "What waiting actually costs" },
    {
      type: "p",
      text: "A 60,000-rupee laptop losing 18% a year sheds roughly 900 rupees every month in year three. Six months of indecision is a 5,000-rupee decision - usually more than the difference between the highest and lowest quote you were comparing.",
    },
    { type: "h2", id: "signals", text: "Three signals it is time" },
    {
      type: "ul",
      items: [
        "You have a replacement already, and the old machine has not been opened in three weeks.",
        "The manufacturer has announced or shipped the next generation of your model - resale prices step down within weeks of a launch.",
        "Battery health has crossed below 80% and is falling, which moves you into a lower condition band.",
      ],
    },
    { type: "h2", id: "seasons", text: "Seasonality in Bangalore" },
    {
      type: "table",
      head: ["Period", "Demand", "What to do"],
      rows: [
        ["June - September", "High (college intake, gaming)", "Best window for gaming and mid-range laptops"],
        ["October - November", "High (festive upgrades)", "Strong for premium and MacBook resale"],
        ["January - February", "Moderate", "Good time to sell before new-model announcements"],
        ["March - May", "Softer", "Sell early in the window rather than waiting it out"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Rule of thumb",
      text: "Sell within 60 days of buying the replacement, and before the next model generation ships. Those two rules capture most of the value most people leave behind.",
    },
    {
      type: "cta",
      title: "Not sure what yours is worth today?",
      text: "Check the live Bangalore price for your exact model in under a minute.",
      to: "/",
      label: "Get today's price",
    },
    { type: "h2", id: "faq", text: "FAQ" },
    {
      type: "faq",
      items: [
        {
          question: "Should I wait for a festive-season offer instead?",
          answer:
            "Exchange offers usually deliver less cash than a straight buyback and lock you into a specific new purchase. Compare the exchange value against a cash quote before deciding.",
        },
        {
          question: "My laptop is not working - is it too late?",
          answer:
            "No. Non-working devices still carry parts value and are evaluated case by case, but they depreciate faster than working ones, so sell sooner.",
        },
      ],
    },
  ],
};

export const blogPosts: BlogPost[] = [pillar, pricing, safety, brand, timing];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost) {
  return post.related
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p));
}

export function getFaqItems(post: BlogPost) {
  const block = post.blocks.find((b) => b.type === "faq");
  return block && block.type === "faq" ? block.items : [];
}

export function getHeadings(post: BlogPost) {
  return post.blocks
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: b.id, text: b.text }));
}

export function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
