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
    "sell-laptop-in-bangalore-instant-cash",
    "sell-macbook-online-instant-cash",
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

/* ------------------------------------------------------------------ */
/* Instant cash cluster                                                */
/* ------------------------------------------------------------------ */

const instantCash: BlogPost = {
  slug: "sell-laptop-in-bangalore-instant-cash",
  title: "Sell Laptop in Bangalore for Instant Cash: The Same-Day Doorstep Payment Guide",
  cardTitle: "Sell laptop in Bangalore for instant cash",
  metaTitle: "Sell Laptop in Bangalore for Instant Cash - Same Day Pickup | HuluMart",
  description:
    "Sell your laptop in Bangalore and get paid the same day. Real instant-cash price bands, the 6-point doorstep check, documents to keep, area-wise pickup timings and how to avoid lowball offers.",
  excerpt:
    "What 'instant cash' really means in Bangalore's laptop market: how payment is released at your door, what gets checked in six minutes, and the price bands you should expect before anyone rings your bell.",
  keywords: [
    "sell laptop in bangalore",
    "sell laptop for instant cash bangalore",
    "sell old laptop for cash bangalore",
    "instant cash for laptop bangalore",
    "same day laptop pickup bangalore",
    "laptop buyers near me bangalore",
  ],
  cluster: "guide",
  clusterLabel: "Instant cash",
  readMinutes: 11,
  datePublished: "2026-08-07",
  dateModified: "2026-08-07",
  author: AUTHOR,
  related: [
    "sell-used-laptop-in-bangalore",
    "sell-macbook-online-instant-cash",
    "wipe-data-before-selling-laptop",
    "used-laptop-resale-value-calculation",
  ],
  blocks: [
    {
      type: "p",
      text: "\u201cInstant cash\u201d is the most abused phrase in Bangalore's second-hand electronics market. Some buyers mean money in your account before the rider leaves your gate. Others mean a promise, a device in a backpack, and a payment link that arrives \u2014 or does not \u2014 after \u201cquality check at the warehouse\u201d. This guide is about the first kind, and how to make sure that is the kind you get.",
    },
    {
      type: "p",
      text: "If you only remember one line: the device and the money should change hands in the same minute, in your doorway, with a written record of both. Everything below is detail around that single rule.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "The 30-second version",
      text: "Get a price online, book a free doorstep pickup slot, keep the laptop charged and the charger ready, let the executive run a 6-minute check, confirm the final figure, then take UPI or cash before handing the device over. Most Bangalore pickups finish in under 20 minutes.",
    },

    { type: "h2", id: "what-instant-means", text: "What \u201cinstant cash\u201d should mean at your door" },
    {
      type: "p",
      text: "A legitimate same-day buyback follows a fixed sequence. If a buyer skips any of these steps, that is your cue to pause the deal, not to hurry it.",
    },
    {
      type: "ol",
      items: [
        "You get an indicative online price for your exact model and configuration before anyone is dispatched.",
        "You pick a pickup slot; the executive arrives with an ID and the booking reference.",
        "The physical check happens in front of you \u2014 nothing is taken to a car or another room.",
        "Any change from the online figure is explained line by line, with the reason (battery health, dent, missing charger).",
        "You approve the final number. Not before.",
        "Payment is released to your UPI ID or handed over in cash while the laptop is still on your table.",
        "You get a pickup receipt or invoice recording the model, serial number, amount and date.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Never accept these three",
      text: "\u201cWe will transfer after warehouse QC.\u201d \u201cThe payment is processing, here is a screenshot.\u201d \u201cSign this and we will fill the amount later.\u201d All three are how sellers in this city lose devices. No receipt, no serial number, no handover.",
    },

    { type: "h2", id: "price-bands", text: "Instant-cash price bands in Bangalore right now" },
    {
      type: "p",
      text: "Same-day cash usually settles slightly below a patient private sale and well above a shop's walk-in offer, because the buyer is absorbing pickup, refurbishing and resale risk. These are the ranges we see most often for fully working machines with no display damage.",
    },
    {
      type: "table",
      caption: "Typical same-day payout by device type and age (working condition, charger included)",
      head: ["Device", "1-2 years old", "3-4 years old", "5+ years old"],
      rows: [
        ["MacBook Air / Pro (M-series)", "55-70% of invoice", "40-55%", "25-35%"],
        ["Premium Windows (XPS, Spectre, ThinkPad X)", "45-55%", "30-40%", "15-22%"],
        ["Mainstream Windows (Inspiron, Vivobook, IdeaPad)", "35-45%", "22-32%", "10-18%"],
        ["Gaming laptops (RTX series)", "45-55%", "30-42%", "15-25%"],
        ["Entry / Celeron / 4GB RAM machines", "25-35%", "12-20%", "Parts value only"],
      ],
    },
    {
      type: "p",
      text: "Two things move you up a band more than anything else: RAM/SSD capacity and battery health. Two things move you down a band instantly: a cracked or spotted display and a missing original charger. Nothing else \u2014 not scratches, not a worn keycap \u2014 changes the number as much as those four.",
    },
    {
      type: "cta",
      title: "See your instant-cash figure first",
      text: "Pick your brand and model to see what HuluMart pays in Bangalore today, then book a free doorstep pickup slot.",
      to: "/",
      label: "Check my laptop price",
    },

    { type: "h2", id: "six-minute-check", text: "The 6-minute doorstep check, explained" },
    {
      type: "p",
      text: "Nothing about the inspection should be mysterious. Here is exactly what the executive looks at and why each item matters to the final figure.",
    },
    {
      type: "table",
      head: ["Check", "How it is done", "Why it changes your price"],
      rows: [
        ["Power-on and boot", "Cold boot to desktop", "Confirms board, storage and OS health"],
        ["Display", "White and black full-screen test", "Dead pixels, backlight bleed, spots are the costliest defect"],
        ["Battery health", "System report / cycle count", "Below 80% health usually moves one condition step"],
        ["Keyboard and trackpad", "Every key, multi-touch gestures", "Individual dead keys are cheap; a full deck swap is not"],
        ["Ports and Wi-Fi", "USB, HDMI, audio, network connect", "A dead port limits who will buy it next"],
        ["Body and hinge", "Lid open/close, dents, screw heads", "Loose hinges signal a drop; opened screws signal past repair"],
      ],
    },
    {
      type: "p",
      text: "Prepare for it and you protect your own price: charge the laptop past 60%, remove your screen lock or keep the password ready, keep the charger and the original box if you still have it, and clean the screen and palm rest. A device that boots in ten seconds and looks cared for genuinely lands in a higher condition bucket than the same machine handed over dusty and dead.",
    },

    { type: "h2", id: "before-handover", text: "Do this before you hand it over" },
    {
      type: "ul",
      items: [
        "Back up everything you need \u2014 the sale is final and data is not recoverable afterwards.",
        "Sign out of your Google, Microsoft and Apple accounts, and turn off Find My / device locks.",
        "Perform a full factory reset with drive encryption enabled, not just a file delete.",
        "Remove any SD card, SIM, dongle or personal sticker.",
        "Photograph the laptop and the serial number sticker before pickup.",
        "Keep the pickup receipt or invoice until the payment reflects in your account.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Data safety is your job, not the buyer's",
      text: "A reputable buyer will wipe the drive again on their side, but you should never rely on that. Our full walkthrough covers Windows, macOS and encrypted-drive cases step by step.",
    },

    { type: "h2", id: "areas", text: "Same-day pickup across Bangalore" },
    {
      type: "p",
      text: `Doorstep pickup runs across the city \u2014 ${topAreas
        .slice(0, 10)
        .map((a) => a.name)
        .join(", ")} and the surrounding neighbourhoods. Central and north-east areas usually get a same-day slot when the booking lands before 4pm; outer corridors like Whitefield, Sarjapur Road and Electronic City are typically next-morning if you book late in the evening.`,
    },
    {
      type: "ul",
      items: [
        "Apartment gate entry: share the executive's name at the security desk to avoid a 15-minute wait.",
        "Office pickup: reception handover works, but the payment still goes to the registered seller's UPI.",
        "Bulk pickups (5+ devices from a company): scheduled separately with an itemised invoice.",
      ],
    },

    { type: "h2", id: "compare", text: "Instant cash vs the other options" },
    {
      type: "table",
      head: ["Route", "Money in hand", "Effort", "Risk"],
      rows: [
        ["Doorstep buyback", "Same day", "One booking", "Low \u2014 paid before handover"],
        ["Classifieds (OLX / Quikr)", "1-6 weeks", "High \u2014 chats, meetups", "High \u2014 fake payments, no-shows"],
        ["SP Road walk-in shops", "Same day", "You travel", "Medium \u2014 cash only, no paperwork"],
        ["Brand exchange offer", "Instant, as discount", "Low", "Locked to a new purchase"],
      ],
    },
    {
      type: "p",
      text: "The classifieds route wins on the headline number and loses on almost everything else. If your laptop is a common configuration, the extra 2,000-3,000 rupees is real but takes weeks of your time; if it is an unusual or older machine, the private buyer often never appears at all.",
    },

    {
      type: "cta",
      title: "Book a free doorstep pickup",
      text: "Get a price online, choose a slot, and get paid at your door across Bangalore.",
      to: "/pickup",
      label: "Book my pickup",
    },

    { type: "h2", id: "faq", text: "Frequently asked questions" },
    {
      type: "faq",
      items: [
        {
          question: "How fast can I actually get cash for my laptop in Bangalore?",
          answer:
            "Bookings confirmed before roughly 4pm usually get a same-day doorstep slot in most Bangalore areas, and payment is released at the door once you approve the final figure \u2014 typically within 20 minutes of the executive arriving.",
        },
        {
          question: "Do I get cash or a bank transfer?",
          answer:
            "Both are available. Most sellers prefer an instant UPI transfer because it is traceable and reflects immediately; cash can be arranged for the agreed amount at pickup.",
        },
        {
          question: "What if the online price and the doorstep price differ?",
          answer:
            "The online figure assumes the condition you selected. If the physical check finds something different \u2014 lower battery health, a display spot, a missing charger \u2014 the revised number and its reason are shown to you before anything is finalised, and you are free to decline.",
        },
        {
          question: "Can I sell a laptop without the original bill or box?",
          answer:
            "Yes. A bill and box help slightly, but a valid government ID matching the seller is what is actually required. The serial number is recorded on the pickup receipt.",
        },
        {
          question: "Will you buy a laptop that does not switch on?",
          answer:
            "Dead or damaged laptops are still bought for parts value. Expect a substantially lower figure, and expect the quote to be confirmed only after the physical check.",
        },
        {
          question: "Is my data safe after the pickup?",
          answer:
            "Wipe the device yourself before handover \u2014 a factory reset with encryption enabled. The drive is wiped again during refurbishing, but your own reset is the step that actually protects you.",
        },
      ],
    },
  ],
};

const macbookCash: BlogPost = {
  slug: "sell-macbook-online-instant-cash",
  title: "Sell MacBook Online for Instant Cash: 2026 Price Chart, Checks and Payout Guide",
  cardTitle: "Sell MacBook online for instant cash",
  metaTitle: "Sell MacBook Online for Instant Cash - 2026 Price Chart | HuluMart",
  description:
    "Sell your MacBook Air or Pro online and get paid the same day. Model-wise 2026 resale ranges, battery-cycle rules, Find My and Activation Lock steps, and what changes an M-series quote.",
  excerpt:
    "MacBooks hold value better than any Windows laptop \u2014 and lose it faster than owners expect after a battery or a new chip launch. Here is the model-wise chart, the checks that matter, and how to get paid instantly.",
  keywords: [
    "sell macbook online",
    "sell macbook for instant cash",
    "sell macbook air bangalore",
    "sell macbook pro price india",
    "macbook resale value 2026",
    "used macbook buyer bangalore",
  ],
  cluster: "brand",
  clusterLabel: "MacBook",
  readMinutes: 10,
  datePublished: "2026-08-07",
  dateModified: "2026-08-07",
  author: AUTHOR,
  related: [
    "sell-laptop-in-bangalore-instant-cash",
    "sell-macbook-vs-windows-laptop-bangalore",
    "wipe-data-before-selling-laptop",
    "sell-used-laptop-in-bangalore",
  ],
  blocks: [
    {
      type: "p",
      text: "A MacBook is the one laptop most people can sell twice: once as a daily machine and once, years later, as a still-desirable second-hand device. Apple's resale curve is genuinely flatter than the rest of the market \u2014 but it has cliffs, and they land on predictable dates. Knowing where you are on that curve is the whole game.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "The 30-second version",
      text: "M-series MacBooks in good condition hold 45-70% of invoice for the first three years. Battery cycle count, Activation Lock status and screen condition decide most of the rest. Sign out of iCloud and turn off Find My before pickup, or the deal cannot be completed.",
    },

    { type: "h2", id: "why-macbooks-hold", text: "Why MacBooks hold value better" },
    {
      type: "ul",
      items: [
        "One tightly controlled configuration ladder \u2014 buyers know exactly what an M2 Air 8/256 is worth without inspecting spec sheets.",
        "Long software support, so a five-year-old MacBook still runs the current macOS and is still a usable purchase.",
        "Strong second-hand demand from students and designers in Bangalore, especially between June and November.",
        "Build quality that ages visibly better than plastic-bodied Windows machines.",
      ],
    },
    {
      type: "p",
      text: "The flip side: Apple's launch calendar moves the whole market at once. When a new Air or Pro chip ships, the previous two generations step down within weeks. If you are already thinking about selling and a launch is rumoured, sell before it, not after.",
    },

    { type: "h2", id: "price-chart", text: "MacBook instant-cash ranges (2026)" },
    {
      type: "table",
      caption: "Typical same-day payout for working MacBooks with clean displays and healthy batteries",
      head: ["Model", "Good condition", "Fair condition", "Notes"],
      rows: [
        ["MacBook Air M3 (2024)", "\u20b965,000 - \u20b985,000", "\u20b950,000 - \u20b962,000", "16GB / 512GB variants sit at the top"],
        ["MacBook Air M2 (2022)", "\u20b948,000 - \u20b962,000", "\u20b936,000 - \u20b946,000", "Most-traded MacBook in Bangalore"],
        ["MacBook Air M1 (2020)", "\u20b932,000 - \u20b944,000", "\u20b924,000 - \u20b931,000", "Still strong demand; battery decides the band"],
        ["MacBook Pro 14 M3 Pro", "\u20b985,000 - \u20b91,20,000", "\u20b968,000 - \u20b982,000", "Higher RAM adds a real premium"],
        ["MacBook Pro 13 M1 / M2", "\u20b940,000 - \u20b958,000", "\u20b930,000 - \u20b939,000", "Touch Bar models price slightly lower"],
        ["Intel MacBook Pro (2017-2020)", "\u20b918,000 - \u20b932,000", "\u20b910,000 - \u20b917,000", "Butterfly keyboard and battery issues are common"],
      ],
    },
    {
      type: "p",
      text: "Ranges are indicative for Bangalore and move with launches and stock. Use them as a sanity check on any offer you receive \u2014 an online quote for your exact configuration will always be tighter than a chart.",
    },
    {
      type: "cta",
      title: "Get your MacBook's exact quote",
      text: "Choose your MacBook model and configuration to see today's instant-cash figure, then book a free doorstep pickup in Bangalore.",
      to: "/",
      label: "Value my MacBook",
    },

    { type: "h2", id: "what-moves-quote", text: "What actually moves a MacBook quote" },
    { type: "h3", text: "1. Battery cycle count" },
    {
      type: "p",
      text: "Open the system report and check cycles. Under 300 cycles with above 85% capacity keeps you in the top band. Above 800 cycles, or a 'Service Recommended' warning, typically costs one full condition step because the next owner will need a replacement.",
    },
    { type: "h3", text: "2. Display condition" },
    {
      type: "p",
      text: "Anti-reflective coating wear, pressure marks and stage-light dimming are Apple-specific defects that buyers check for deliberately. A perfect panel is worth more on a MacBook than on any other brand, because replacements are expensive.",
    },
    { type: "h3", text: "3. Configuration" },
    {
      type: "p",
      text: "Because storage and memory cannot be upgraded on Apple Silicon, a 16GB/512GB machine commands a genuine premium over the 8GB/256GB base \u2014 often 8,000 to 15,000 rupees on the same model year.",
    },
    { type: "h3", text: "4. Body, keyboard and repairs" },
    {
      type: "p",
      text: "Dents on the lid corner, a bent bottom case, or third-party (non-Apple) repairs all reduce the figure. An Apple service record, by contrast, does not hurt and sometimes helps.",
    },

    { type: "h2", id: "activation-lock", text: "Find My and Activation Lock: do this first" },
    {
      type: "callout",
      tone: "warn",
      title: "A locked MacBook cannot be sold",
      text: "If Find My is still on and the device is tied to your Apple ID, the buyer cannot resell it and the pickup will be cancelled at your door. Sign out before the executive arrives.",
    },
    {
      type: "ol",
      items: [
        "Back up with Time Machine or iCloud, and confirm the backup is complete.",
        "Sign out of iCloud: System Settings \u2192 your name \u2192 Sign Out. Turn off Find My Mac.",
        "Sign out of iMessage, App Store and any Apple TV / Music accounts.",
        "Unpair Bluetooth accessories and remove the Mac from your Apple ID device list.",
        "Erase All Content and Settings (Apple Silicon and T2 Macs) rather than a manual disk erase.",
        "Boot once to the setup screen to confirm the wipe succeeded, then leave it there for the handover.",
      ],
    },

    { type: "h2", id: "online-flow", text: "How the online sale works, end to end" },
    {
      type: "ol",
      items: [
        "Select MacBook, series, model and configuration online to get an indicative price.",
        "Book a free doorstep pickup slot across Bangalore.",
        "The executive verifies model, serial, battery cycles, display and Activation Lock status in front of you.",
        "You approve the final figure \u2014 or decline at no cost.",
        "Payment goes out by instant UPI or cash before the MacBook leaves your hands.",
        "You keep a receipt recording the model, serial number and amount paid.",
      ],
    },
    {
      type: "cta",
      title: "Book a same-day MacBook pickup",
      text: "Free doorstep pickup across Bangalore, payment released before handover.",
      to: "/pickup",
      label: "Book my pickup",
    },

    { type: "h2", id: "faq", text: "Frequently asked questions" },
    {
      type: "faq",
      items: [
        {
          question: "How much is my MacBook worth in 2026?",
          answer:
            "An M2 MacBook Air in good condition typically fetches \u20b948,000-\u20b962,000 in Bangalore, an M1 Air \u20b932,000-\u20b944,000, and a 14-inch M3 Pro \u20b985,000 upwards. Your exact figure depends on configuration, battery cycles and display condition.",
        },
        {
          question: "Can I sell a MacBook online without meeting a buyer?",
          answer:
            "You can complete the price discovery and booking entirely online, but the handover is in person at your door so that the device can be verified and payment released to you on the spot.",
        },
        {
          question: "Does a high battery cycle count reduce the price a lot?",
          answer:
            "Below 300 cycles has little effect. Between 300 and 800 the figure softens gradually, and above 800 cycles \u2014 or with a Service Recommended warning \u2014 expect a full condition-step reduction.",
        },
        {
          question: "Do I need the original box and charger?",
          answer:
            "The charger matters and its absence reduces the payout. The box is a small bonus, not a requirement.",
        },
        {
          question: "What if I forgot to sign out of iCloud?",
          answer:
            "The executive can wait while you sign out, provided you have the Apple ID password on hand. Without it the sale cannot proceed, so do it before the slot.",
        },
        {
          question: "Is a MacBook worth repairing before selling?",
          answer:
            "Usually not. A third-party repair rarely returns its cost in resale, and non-Apple parts can reduce the quote. Sell it as-is and let the buyer absorb the refurbishing.",
        },
      ],
    },
  ],
};

export const blogPosts: BlogPost[] = [
  pillar,
  instantCash,
  macbookCash,
  pricing,
  safety,
  brand,
  timing,
];

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
