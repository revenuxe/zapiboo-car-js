import type { ModelSlug } from "./selling-models";

type Topic = { title: string; text: string };
export type ModelSellingContent = {
  description: string;
  intro: string;
  focus: string;
  identity: Topic;
  valuation: Topic[];
  checklist: string[];
  visit: string;
  faqs: { question: string; answer: string }[];
};

export const modelSellingContent: Record<ModelSlug, ModelSellingContent> = {
  "maruti-swift": {
    description:
      "Sell your Maruti Swift in Bangalore. Prepare variant, gearbox and service details, understand the inspection, and request a free doorstep visit with Zapiboo.",
    intro:
      "Your Swift might be a first car, a regular commuter or the hatchback you are replacing with something bigger. Its selling story starts with the version you own and the care it has received. Arrange a doorstep inspection in Bangalore and discuss an offer after the team has reviewed the car.",
    focus: "Generation, gearbox and everyday upkeep",
    identity: {
      title: "Which Swift are you selling?",
      text: "The Swift name spans different generations and fuel choices. Read the model year and variant from your records, and identify the transmission rather than describing every two-pedal car simply as automatic. If your papers say Swift Dzire, use the Dzire guide: that is the sedan, not this hatchback. Clear identification prevents an irrelevant comparison at the start.",
    },
    valuation: [
      {
        title: "City kilometres need context",
        text: "Explain whether the odometer reflects short office trips, longer highway runs or a mix. Keep clutch, brake and tyre invoices available. Stop-start use can involve plenty of work without a huge distance reading; maintenance evidence helps explain that history without guessing from mileage alone.",
      },
      {
        title: "Describe gear changes accurately",
        text: "For a manual Swift, mention clutch or gear-selection issues you have noticed. For an AGS-equipped car, explain any warning or change in behaviour. Share workshop findings where available; an inspection request is not a remote diagnosis, and modifications should be disclosed with the original specification.",
      },
      {
        title: "Separate appearance from repair history",
        text: "List parking scratches, replaced panels and larger repairs separately. A clean cabin is helpful, but a service folder is more informative than fresh seat covers. Tell the team if alloy wheels, a stereo or other removable accessories will be kept rather than included.",
      },
    ],
    checklist: [
      "Find the variant and fuel type in your registration or purchase records.",
      "Collect clutch, tyre and scheduled-service invoices.",
      "Clear the boot and make the spare wheel area accessible.",
      "List accessory changes and locate both keys.",
    ],
    visit:
      "For a Swift parked in an office basement or apartment bay, share the block, level and visitor-entry process. Choose a Bangalore slot when the car is back from the commute and you can make the keys and records available.",
    faqs: [
      {
        question: "Is this page also for a Swift Dzire?",
        answer:
          "The hatchback Swift and the Dzire sedan have separate guides. Use the Maruti Dzire page if that is the model recorded in your documents, even when an older badge includes Swift.",
      },
      {
        question: "Does a low odometer reading guarantee a better Swift offer?",
        answer:
          "No. Usage, service evidence, age, condition and the exact version all matter. Explain long periods of storage and any maintenance needed alongside the reading.",
      },
      {
        question: "Should I repair every scratch before the Swift inspection?",
        answer:
          "Show the condition as it is and discuss the assessment first. Cosmetic spending does not automatically produce an equal increase in the offer.",
      },
    ],
  },
  "hyundai-creta": {
    description:
      "Sell your Hyundai Creta in Bangalore with a free inspection. Prepare engine, transmission, equipment and maintenance details before discussing your offer.",
    intro:
      "From family journeys to weekday commutes, your Creta's history is more specific than its SUV badge. Tell us the generation, engine and transmission, then arrange a free inspection to discuss its condition and a market-linked offer. You decide whether the proposed sale works for you.",
    focus: "Engine choice, transmission and fitted equipment",
    identity: {
      title: "Identify the Creta beyond its trim badge",
      text: "Creta specifications vary by model year. Petrol, diesel and turbo-petrol versions are not interchangeable comparisons, and automatic transmissions differ too. Use your invoice or service records to identify what is fitted. If you own a Creta Electric, say so at the enquiry stage so the team can confirm the appropriate assessment.",
    },
    valuation: [
      {
        title: "Make the service history easy to follow",
        text: "Arrange invoices by date and identify major engine or transmission work. Mention dashboard warnings, changes in starting or shifting, and workshop visits that did not resolve a concern. Do not assume a fault is normal for all Cretas; describe what your own car does.",
      },
      {
        title: "Check the equipment your variant actually has",
        text: "List problems with cameras, displays, climate control or a sunroof where fitted. Equipment differs across generations and trims, so avoid copying a current brochure into your vehicle description. Disclose replaced glass, repaired electronics and aftermarket additions with their records.",
      },
      {
        title: "Explain family and travel wear",
        text: "Show the rear seats, boot, tyres and any underbody repairs as well as the front cabin. Mention rough-road journeys or damage you know about. Roof carriers and other touring accessories should be listed separately so everyone understands what remains with the vehicle.",
      },
    ],
    checklist: [
      "Identify the fuel, transmission and trim from the car's own records.",
      "Collect invoices for major repairs and equipment replacements.",
      "Make the rear seats and tailgate accessible.",
      "Note warning lights and clarify which accessories are included.",
    ],
    visit:
      "Allow room to open the Creta's doors and tailgate. If your Bangalore apartment has a narrow bay, arrange an accessible inspection space and tell the team about gate clearance, entry permission and where you will meet them.",
    faqs: [
      {
        question: "Why does a Creta inspection start in the Car category?",
        answer:
          "The booking flow groups SUVs under Car. Choose SUV on the body-style step and then Hyundai and your vehicle details.",
      },
      {
        question: "Can I compare my older Creta with a current showroom variant?",
        answer:
          "Use the specification and condition of your own vehicle. Equipment and powertrains change over time, so a current showroom price or matching trim name is not a direct resale valuation.",
      },
      {
        question: "Can I enquire about a Creta Electric here?",
        answer:
          "Yes, but make the electric powertrain clear when contacting the team. Battery information, charging equipment and eligibility need to be reviewed for that specific model.",
      },
    ],
  },
  "honda-city": {
    description:
      "Sell your Honda City in Bangalore. Understand generation and powertrain differences, organise service evidence and arrange a free doorstep inspection.",
    intro:
      "A well-documented City gives the inspection team more to work with than a polished exterior alone. Whether you are moving from a sedan to an SUV or selling a second car, begin with the generation, powertrain and maintenance history. Request a Bangalore visit and review the offer before committing.",
    focus: "Sedan condition and powertrain identification",
    identity: {
      title: "Start with the City generation and powertrain",
      text: "Honda City models have changed over the years. Identify the model year, fuel type and transmission from the vehicle's records. A conventional petrol CVT and a City e:HEV are different configurations; calling both automatic leaves out useful information. Describe an older car using its own specification rather than the latest model's feature list.",
    },
    valuation: [
      {
        title: "Gearbox and maintenance evidence",
        text: "Bring service invoices that show what work was completed and when. Mention unusual engine sounds, shifting behaviour or warning lights rather than attempting a diagnosis. For a hybrid, include available hybrid-system or battery records and ask the team to confirm assessment arrangements.",
      },
      {
        title: "Longer-body parking and underbody history",
        text: "Explain bumper repairs, underbody impacts and any suspension work you know about. Make a distinction between a cosmetic parking repair and more extensive accident work. Photographs or invoices from repairs are useful when they clarify what actually happened.",
      },
      {
        title: "Rear-seat and comfort condition",
        text: "For a sedan used by family members or with a driver, give the rear cabin as much attention as the front. Note air-conditioning problems, seat damage and non-working controls. Remove covers or personal items only where practical so the condition can be seen clearly.",
      },
    ],
    checklist: [
      "Identify the generation, variant and transmission in your records.",
      "Gather gearbox or hybrid-related invoices where relevant.",
      "Empty the boot and rear-seat storage areas.",
      "Note bumper, suspension and underbody repairs.",
    ],
    visit:
      "Choose a Bangalore parking spot with room around the front and rear of the City. If somebody else normally drives it, arrange for the keys and service file to be available and have the owner reachable for the offer discussion.",
    faqs: [
      {
        question: "Should I describe a City e:HEV as a regular CVT car?",
        answer:
          "No. State that it is the e:HEV hybrid and share its model year and records. That identifies the powertrain more clearly and allows the team to confirm the right assessment.",
      },
      {
        question: "What if my City has mainly been chauffeur-driven?",
        answer:
          "Explain the actual use, service history and condition throughout the cabin. Who drove the car does not by itself determine its value; the inspection and records matter.",
      },
      {
        question: "Can an older Honda City be considered?",
        answer:
          "Share its year, registration details and running condition with the team first. Eligibility and any booking limitations should be confirmed before planning the visit.",
      },
    ],
  },
  "maruti-dzire": {
    description:
      "Sell your Maruti Dzire in Bangalore. Explain private or business use, variant and maintenance history, then request a free doorstep inspection.",
    intro:
      "Your Dzire may have served as a family sedan or spent its days on a regular working route. A useful offer discussion begins with that distinction, alongside the version and condition. Arrange a free inspection and explain how the vehicle has been used before making your sale decision.",
    focus: "Private use, working history and the exact version",
    identity: {
      title: "Dzire, Swift Dzire or a working sedan?",
      text: "Older paperwork may use the Swift Dzire name. Share the complete model description and registration details, including any Tour designation or business use. Do not select a private-car description just because the body looks familiar. The team can advise on the appropriate booking category for a commercially registered vehicle.",
    },
    valuation: [
      {
        title: "Distance and route pattern",
        text: "A long odometer history is easier to understand with service records and an account of the work done. Explain city duty, highway runs or occasional household use. If the vehicle changed from one pattern to another, describe both periods and avoid presenting only the quieter recent months.",
      },
      {
        title: "Fuel and transmission records",
        text: "Dzire versions across years include different fuel and gearbox choices. Identify yours from the documents and mention any fuel-system changes. For a CNG-equipped vehicle, share the installation and service information available rather than assuming all systems have the same history.",
      },
      {
        title: "Passenger cabin and luggage space",
        text: "Check rear-seat wear, door handles, windows, air-conditioning and boot condition. If the car carried passengers for work, be clear about that use. Repairs to seat trim can improve appearance, but they do not replace an honest account of the vehicle's operating history.",
      },
    ],
    checklist: [
      "Locate the full model name and registration-use details.",
      "Sort maintenance records against the odometer history.",
      "Prepare fuel-system records where applicable.",
      "Empty the cabin and boot of personal or customer property.",
    ],
    visit:
      "If your Dzire is still working a route in Bangalore, agree a time when it will be back and unloaded. For a privately used car, choose a slot that allows the registered owner and service records to be available without rushing the inspection.",
    faqs: [
      {
        question: "Is an older Swift Dzire covered by this guide?",
        answer:
          "Yes. Share the complete name, year and version from the records. This page is for the sedan; the Swift hatchback has a separate guide.",
      },
      {
        question: "Can I enquire about a taxi or Tour version?",
        answer:
          "Yes. Tell the team the registration use and exact version before booking. They can confirm eligibility and whether the commercial-vehicle process is more appropriate.",
      },
      {
        question: "Should I stop using my Dzire after inspection?",
        answer:
          "Agree the expected handover and any continued use with the team. Disclose changes in mileage or condition before finalising the sale.",
      },
    ],
  },
  "maruti-baleno": {
    description:
      "Sell your Maruti Baleno in Bangalore. Identify the model generation, check cabin equipment and service records, and arrange a free inspection with Zapiboo.",
    intro:
      "Selling your Baleno starts with separating the car's specification from the equipment added over time. Share its year, variant and service history, then arrange a Bangalore inspection. A clear description helps the team assess your hatchback and explain the offer on the car in front of them.",
    focus: "Variant equipment and original specification",
    identity: {
      title: "Identify the Baleno in your records",
      text: "Use the model year, body style, fuel type and transmission to identify your Baleno. The name has a longer history than the current hatchback, so mention an older sedan explicitly. A similar trim badge on another year's car is not proof that the engine, gearbox or features match yours.",
    },
    valuation: [
      {
        title: "Factory features versus later additions",
        text: "Describe the equipment actually installed, including any replacement infotainment unit, cameras or wheels. Note which controls work and which do not. Retain original parts or invoices where available and tell the team whether those parts will be included in the sale.",
      },
      {
        title: "Gearbox and service continuity",
        text: "Share the exact transmission and its maintenance records rather than a broad automatic label. Explain missed services and any independent-workshop work honestly. A gap in one service book can sometimes be explained by separate bills, so bring the evidence you have.",
      },
      {
        title: "Hatchback load-area condition",
        text: "Make the boot, parcel shelf and rear seats visible. Mention damaged trim, repaired rear panels or water entry you have observed. Do not mask an intermittent problem with a temporary fix solely for inspection; describe when it happens and what has already been tried.",
      },
    ],
    checklist: [
      "Confirm body style, year and variant from your documents.",
      "List replaced electronics and other accessories.",
      "Collect available automatic-transmission service records.",
      "Clear the hatch area and locate the parcel shelf and spare key.",
    ],
    visit:
      "For a Baleno kept at a Bangalore office, book when access to the car park is permitted and you can open the hatch fully. Share visitor instructions and keep the service folder with you rather than at a different address.",
    faqs: [
      {
        question: "Does every Baleno automatic have the same gearbox?",
        answer:
          "Do not assume so across model years. Identify the transmission from your purchase or service records and share those details before comparing offers.",
      },
      {
        question: "Will a newer touchscreen increase my Baleno's value?",
        answer:
          "It is not an automatic addition at its purchase cost. Explain the installation and what equipment is included; the offer considers the complete vehicle.",
      },
      {
        question: "Can I enquire about an older Baleno sedan?",
        answer:
          "Contact the team with its year, body style and condition. Make clear that it is the sedan so eligibility can be confirmed without confusing it with the hatchback.",
      },
    ],
  },
  "maruti-wagon-r": {
    description:
      "Sell your Maruti Wagon R in Bangalore. Prepare engine, CNG and usage details, review inspection considerations and request a free doorstep visit.",
    intro:
      "A Wagon R often handles the practical jobs: commuting, family errands and frequent short trips. When it is time to sell, explain those routines alongside the version and service history. Start an inspection request and discuss an offer based on condition rather than a familiar model name alone.",
    focus: "Engine version, fuel setup and practical use",
    identity: {
      title: "Check the engine and fuel setup first",
      text: "Wagon R models across years have different engine and fuel configurations. Share the exact variant, transmission and whether a CNG system is factory-fitted or was installed later, if applicable. Your registration and purchase records are better starting points than an online listing for a car that merely looks similar.",
    },
    valuation: [
      {
        title: "Fuel-system history",
        text: "For a CNG-equipped Wagon R, gather the available installation, service and related vehicle records. Explain starting or fuel-switching issues you know about. Confirm any transaction-specific paperwork with the team; do not treat a generic internet checklist as a substitute for reviewing your own vehicle.",
      },
      {
        title: "Short trips and periods parked",
        text: "Tell the team about very short daily trips, extended storage or irregular servicing. Mention a weak battery, starting concerns or repairs after a long idle period. Low distance does not describe maintenance by itself, particularly when the vehicle has spent time unused.",
      },
      {
        title: "Cabin utility and body condition",
        text: "Show seat folding, door operation and boot access. Describe trim damage from carrying bulky items and any body repairs. If the car was used for passenger work, disclose that history along with the registration use rather than relying on its household-car appearance.",
      },
    ],
    checklist: [
      "Identify the engine, transmission and fuel system.",
      "Find CNG-related records if your vehicle uses it.",
      "Make seat mechanisms and storage areas accessible.",
      "Explain recent storage periods or battery replacements.",
    ],
    visit:
      "Coordinate a Bangalore visit with everyone who shares the Wagon R at home. Keep it at the booked address with access to the boot and cabin, and mention in advance if it is not currently starting reliably.",
    faqs: [
      {
        question: "Can I enquire about a CNG Wagon R?",
        answer:
          "Yes. Describe the system and share available records. The team will need to confirm the details and eligibility for your particular car.",
      },
      {
        question: "Is the engine size needed if I already know the variant?",
        answer:
          "Share it if your records identify it. Across years, a familiar variant label may not fully describe the engine and fuel configuration.",
      },
      {
        question: "What if my Wagon R has barely been used recently?",
        answer:
          "Explain how long it has been parked, whether it starts and any overdue servicing. Those details help plan the inspection and put the odometer reading in context.",
      },
    ],
  },
  "maruti-brezza": {
    description:
      "Sell your Maruti Brezza in Bangalore. Explain the version, drivetrain records and SUV condition before booking a free doorstep inspection with Zapiboo.",
    intro:
      "Moving on from your Brezza means describing more than an SUV trim badge. Identify the version, explain its journeys and gather the records that show how it has been maintained. Arrange a Bangalore inspection to review the car and discuss the next steps for selling.",
    focus: "Brezza identity and ownership history",
    identity: {
      title: "Use the complete name and model year",
      text: "Your documents may use Vitara Brezza or Brezza depending on the vehicle. Share the full name, fuel type, model year and transmission. Do not borrow the equipment list from the latest Brezza when describing an earlier car. The details in your own paperwork help establish a relevant assessment.",
    },
    valuation: [
      {
        title: "Powertrain and repair documentation",
        text: "Bring invoices for engine, clutch or transmission work and note unresolved warnings. Explain changes in driving behaviour rather than diagnosing a model-wide problem. If fuel equipment or mechanical parts have been altered, disclose the work and the records that support it.",
      },
      {
        title: "Urban SUV wear",
        text: "Show bumper corners, wheels, tyres and repaired body areas. Mention kerb impacts or suspension work if known. A compact exterior does not mean every inspection space is suitable; room around the vehicle helps the team see condition without obstacles.",
      },
      {
        title: "Trim and included equipment",
        text: "Check the features fitted to your version and list any faults. If you have added roof accessories, a camera or an audio system, say whether they stay. The cost of an addition and its contribution to a sale offer are not necessarily the same.",
      },
    ],
    checklist: [
      "Record the full model name, fuel and transmission.",
      "Locate invoices for significant mechanical work.",
      "Check keys, fitted equipment and removable accessories.",
      "Clear luggage from the boot and rear cabin.",
    ],
    visit:
      "For a Brezza used on trips out of Bangalore, select an appointment after it returns to the booked address. Tell the team about any condition change before the visit and arrange space to open the tailgate and doors.",
    faqs: [
      {
        question: "Is a Vitara Brezza included on this page?",
        answer:
          "Yes. Use the full model name and year from your records so the team can distinguish it from later Brezza versions.",
      },
      {
        question: "Do I book a Brezza under Car or SUV?",
        answer:
          "Begin with Car in booking, then choose SUV as the body style before adding the brand and vehicle details.",
      },
      {
        question: "Should I include the roof carrier in the sale?",
        answer:
          "That is part of the agreement. Tell the team whether it is included and list any items you will remove before handover.",
      },
    ],
  },
  "tata-nexon": {
    description:
      "Sell your Tata Nexon in Bangalore. Share petrol, diesel or EV details, organise maintenance records and request a free inspection for your specific vehicle.",
    intro:
      "A Nexon enquiry needs one important detail at the start: which powertrain are you selling? Give the team the exact version and condition so they can prepare the right conversation. Arrange an inspection in Bangalore and review the offer once your vehicle has been assessed.",
    focus: "Powertrain clarity and supporting records",
    identity: {
      title: "Specify your Nexon's powertrain",
      text: "State the fuel or electric powertrain and exact variant rather than only Nexon. Different versions need different records and inspection discussions. For an electric model, share the battery-related information available and confirm eligibility with the team. For another version, identify the transmission using the vehicle's own documents.",
    },
    valuation: [
      {
        title: "Electric ownership information",
        text: "If yours is an EV, gather available battery reports, service invoices and charger details. Explain charging behaviour, warnings and the range you experience in context. Avoid treating a dashboard range estimate as a certified battery-health result, and mention any equipment that is not owned outright.",
      },
      {
        title: "Engine and gearbox evidence",
        text: "For a combustion-engine Nexon, bring maintenance records and explain warning lights, starting concerns or gear-selection issues. List unresolved faults alongside completed repairs. Do not apply an EV comparison to a petrol or diesel vehicle simply because the badge is similar.",
      },
      {
        title: "Body, cabin and electronic features",
        text: "Identify repaired panels, underbody impacts and non-working displays or controls. Describe the equipment fitted to your year and variant. If software or electronic work was carried out by a workshop, keep the corresponding job card with the rest of the service history.",
      },
    ],
    checklist: [
      "Confirm the powertrain and exact variant.",
      "Gather relevant engine or battery-service records.",
      "List chargers and accessories included, where applicable.",
      "Note warnings and make the cabin and boot accessible.",
    ],
    visit:
      "Share the actual Bangalore location where the Nexon will be parked. For an EV, mention available charging access and the vehicle's current operating condition when arranging the appointment so the team can confirm what is needed for the visit.",
    faqs: [
      {
        question: "Can I enquire about a Nexon EV?",
        answer:
          "Yes. Clearly identify the electric version, model year and condition. The team must confirm eligibility and assessment arrangements for your vehicle.",
      },
      {
        question: "Is displayed EV range enough to value my Nexon?",
        answer:
          "No. Explain your usage and charging experience and bring available records. A displayed estimate is one observation and does not replace a vehicle or battery assessment.",
      },
      {
        question: "Do the charger and charging accessories need to be included?",
        answer:
          "List what you own and what you intend to include. Any leased, financed or missing equipment should be discussed before agreeing the sale.",
      },
    ],
  },
  "royal-enfield-classic-350": {
    description:
      "Sell your Royal Enfield Classic 350 in Bangalore. Prepare generation, service and accessory details, then request a free doorstep motorcycle inspection.",
    intro:
      "A Classic 350 can carry years of weekend rides, touring additions and personal changes. When selling, separate that story into the motorcycle's original version, maintenance and equipment included. Request a free Bangalore inspection and discuss an offer with those details made clear.",
    focus: "Generation, touring history and modifications",
    identity: {
      title: "Distinguish the Classic 350 generation",
      text: "The Classic 350 spans earlier models and the newer J-platform generation introduced in 2021. Use the manufacturing information and purchase records to identify your bike rather than relying on registration year alone. Tell the team about changed exhausts, seats or handlebars so the original motorcycle and its current configuration are both understood.",
    },
    valuation: [
      {
        title: "Maintenance beyond the odometer",
        text: "Arrange engine, clutch, chain-set and brake invoices by date. Describe long rides, short outings and periods parked between trips. Mention starting difficulty, leaks or noises you have observed without dismissing every symptom as part of the bike's character.",
      },
      {
        title: "Touring and accessory history",
        text: "List luggage frames, crash bars, lights and other additions. Identify whether original parts are available and which accessories will remain with the bike. Their retail prices do not automatically add up to a matching increase in the offer.",
      },
      {
        title: "Finish and fall repairs",
        text: "Show tank and mudguard repairs, corrosion, wheel condition and damage from drops. Share any repair records rather than hiding marks before the inspection. The team needs a clear picture of this particular Classic, including faults that only appear after a ride.",
      },
    ],
    checklist: [
      "Identify the generation using the vehicle's records.",
      "Collect service and major repair invoices.",
      "List fitted accessories and any original parts kept separately.",
      "Park with room to inspect both sides and mention starting problems.",
    ],
    visit:
      "If your Classic is kept for weekend rides outside Bangalore, pick a slot when it is home and accessible. Tell the team if it has stood for a long time, and keep keys and accessory records ready before the inspection.",
    faqs: [
      {
        question: "Is every Classic registered in 2021 the newer generation?",
        answer:
          "Registration year alone is not enough to establish the version. Use manufacturing details, purchase records and the actual motorcycle specification to identify it.",
      },
      {
        question: "Will my touring accessories be valued at their purchase price?",
        answer:
          "No fixed accessory value is promised. Agree which parts are included and let the team assess the complete bike and its condition.",
      },
      {
        question: "Should I disclose a changed exhaust on my Classic 350?",
        answer:
          "Yes. Explain the modification and whether the original exhaust is available. The team needs to assess the motorcycle in its current configuration.",
      },
    ],
  },
  "hero-splendor-plus": {
    description:
      "Sell your Hero Splendor Plus in Bangalore. Explain daily use, service history and starting condition, and request a free doorstep inspection with Zapiboo.",
    intro:
      "Your Splendor Plus may have covered dependable daily runs for years. To prepare for selling, put that use into a clear maintenance story: what has been replaced, how it starts and what needs attention. Arrange a Bangalore inspection and review the offer for your actual bike.",
    focus: "Daily-use history and maintenance continuity",
    identity: {
      title: "Use the complete Splendor model name",
      text: "Read the full version from your documents, including any variant suffix. Splendor Plus is not a substitute name for every motorcycle in the wider Splendor family. Share the year and fitted equipment, particularly if a display, wheel or other part has been changed during ownership.",
    },
    valuation: [
      {
        title: "Daily distance and service records",
        text: "Explain commuting, delivery use or occasional household trips. Bring oil-service and repair bills where you have them, including work outside a dealer workshop. A consistent history helps the team understand the distance covered without relying only on a freshly cleaned bike.",
      },
      {
        title: "Starting and everyday operation",
        text: "Describe cold-start problems, stalling, lighting faults and changes in gear selection. Tell the team whether the motorcycle is currently being ridden or has been parked. Do not arrange a riding demonstration if you know there is a safety-related fault; disclose the condition first.",
      },
      {
        title: "Consumables and load-related wear",
        text: "Keep records of chain-set, tyre, brake and suspension work. Note worn seats, damaged carriers or repairs associated with carrying goods. If a carrier is removable, decide whether it stays with the motorcycle and make that part of the offer discussion.",
      },
    ],
    checklist: [
      "Check the full model and variant name.",
      "Note the current odometer and typical daily use.",
      "Gather recent tyre, chain and brake bills.",
      "Explain starting condition and list included carriers or accessories.",
    ],
    visit:
      "If your Splendor Plus is used every working day, select a Bangalore inspection slot between trips when the motorcycle will definitely be present. An accessible parking spot and the owner's availability are more useful than a rushed visit during a delivery run.",
    faqs: [
      {
        question: "Does this page cover every bike called Splendor?",
        answer:
          "This guide focuses on Splendor Plus. For another version, share its full name with the team and confirm the correct model during booking.",
      },
      {
        question: "Can a high-mileage Splendor Plus be considered?",
        answer:
          "Share the year, distance, running condition and maintenance records. Eligibility and an offer depend on the particular bike, not the odometer alone.",
      },
      {
        question: "Are independent-workshop service bills useful?",
        answer:
          "Yes. Bring available invoices and explain what was done. Be clear about any gaps rather than creating a service history from memory.",
      },
    ],
  },
  "bajaj-pulsar": {
    description:
      "Sell your Bajaj Pulsar in Bangalore. Identify the exact Pulsar model, disclose modifications and maintenance, and request a free motorcycle inspection.",
    intro:
      "Pulsar is a model family, so the first step is to identify your bike precisely. Add the full model designation, explain its use and gather service records before arranging an inspection. Zapiboo can then discuss the particular motorcycle you want to sell in Bangalore.",
    focus: "Exact model designation and riding history",
    identity: {
      title: "Pulsar needs more than a brand badge",
      text: "Include the full designation and engine size as recorded in your documents, together with the year. Do not group a different Pulsar series under the nearest familiar number. Fairings, wheels and accessories may have been changed, so use the bike's records to distinguish the original specification from its current appearance.",
    },
    valuation: [
      {
        title: "Mechanical and riding history",
        text: "Explain commuting, longer rides and any engine, clutch or gearbox repairs. Report symptoms such as difficult starts or unusual noises in your own words. A claimed performance upgrade is not a substitute for documented maintenance and needs to be disclosed as a modification.",
      },
      {
        title: "Braking, tyres and suspension",
        text: "Gather replacement records and mention any current braking or handling concern. Share the fitted brake configuration if known and note warning lights. The purpose is to describe this bike accurately, not to assume every Pulsar has the same equipment.",
      },
      {
        title: "Body panels and aftermarket parts",
        text: "On a bike with fairings, identify repaired or replaced panels as well as cosmetic scratches. List changed exhausts, levers, lights or wiring. Say whether original parts come with the sale and disclose damage from a fall even when the visible panel has been replaced.",
      },
    ],
    checklist: [
      "Find the complete Pulsar model designation in the documents.",
      "Collect engine, brake and suspension repair invoices.",
      "List aftermarket parts and available originals.",
      "Explain fall repairs and current riding issues before the visit.",
    ],
    visit:
      "Book where the Pulsar is actually kept in Bangalore, with room to see both sides and any fitted bodywork. If it cannot currently be ridden, explain that when arranging the appointment rather than planning an unconfirmed movement to another location.",
    faqs: [
      {
        question: "Can I just enter Pulsar as the model?",
        answer:
          "Include the full series or number and the year wherever possible. Pulsar covers different motorcycles, and those details prevent an unsuitable comparison.",
      },
      {
        question: "Do performance modifications guarantee a higher offer?",
        answer:
          "No. Disclose the modifications, their records and whether original parts are available. The assessment considers the complete bike and its condition.",
      },
      {
        question: "Should I disclose replaced fairing panels?",
        answer:
          "Yes. Explain why they were replaced and share repair evidence if available. New-looking panels do not remove the need to describe previous damage.",
      },
    ],
  },
  "honda-activa": {
    description:
      "Sell your Honda Activa in Bangalore. Identify the generation and version, prepare service and key details, and arrange a free doorstep scooter inspection.",
    intro:
      "An Activa shared across the household has a history that mileage alone may not explain. Identify the generation and version, note how it starts and gather the records you have. Start a free Bangalore inspection request and discuss the offer before deciding to sell.",
    focus: "Activa version, starting and shared daily use",
    identity: {
      title: "Activa 110, Activa 125 or another generation?",
      text: "Read the exact model and generation from your records. The Activa name covers different scooters, and the fitted equipment depends on the version and year. For an electric Activa, make the powertrain explicit and contact the team to confirm eligibility; do not describe it using petrol-scooter details.",
    },
    valuation: [
      {
        title: "Starting and automatic-drive behaviour",
        text: "Mention cold-start difficulty, vibration when moving off or unusual sounds. Bring records of drive-belt, clutch or battery work if available. Describe when a symptom occurs and whether the scooter is still in daily use so the inspection can be planned sensibly.",
      },
      {
        title: "Keys, locks and household wear",
        text: "Check that storage, fuel access and fitted locks can be opened. Locate spare keys or fobs and mention anything missing. Show seat damage, cracked panels and mirror repairs rather than covering them for the visit. These practical details matter during a scooter handover.",
      },
      {
        title: "Who used it and how often",
        text: "Explain a daily office run, short errands or delivery work, including changes in use. Gather tyre and brake replacement records. If several people share it, ask about known faults before the inspection so the description does not depend on only one rider's experience.",
      },
    ],
    checklist: [
      "Identify the Activa version and year.",
      "Empty under-seat and front storage areas.",
      "Find every key or fob and test access to locked compartments.",
      "Gather service bills and describe starting or moving-off issues.",
    ],
    visit:
      "Choose a Bangalore slot when everyone sharing the Activa knows it must remain at the booked address. Have the keys with the person meeting the inspector and arrange enough space around the scooter to open storage and view its panels.",
    faqs: [
      {
        question: "Can I enquire about both Activa 110 and Activa 125?",
        answer:
          "Yes. Specify which one you own, along with its generation and year. The exact version is needed for an appropriate assessment.",
      },
      {
        question: "What if the Activa's spare key is missing?",
        answer:
          "Tell the team before the visit and identify which locks or functions can still be used. Agree the keys included in any sale rather than assuming a full set is available.",
      },
      {
        question: "Is a freshly serviced Activa guaranteed a higher price?",
        answer:
          "No fixed increase is promised. A service invoice helps explain completed work, while the offer still depends on the scooter's version, condition and other assessment details.",
      },
    ],
  },
  "tvs-jupiter": {
    description:
      "Sell your TVS Jupiter in Bangalore. Prepare 110 or 125 version details, inspect daily-use features and request a free doorstep scooter assessment.",
    intro:
      "Before selling a Jupiter, identify the version and explain the routines it has handled. Everyday features such as storage access and working controls deserve attention alongside the engine. Arrange a Bangalore inspection and talk through an offer for the scooter you own.",
    focus: "110 or 125 identity and everyday practicality",
    identity: {
      title: "Name the Jupiter version accurately",
      text: "Jupiter 110 and Jupiter 125 are separate model choices, and generations differ too. Use the exact description in your records rather than identifying the scooter from colour alone. List the equipment actually fitted, especially if a display, wheel or body panel has been replaced.",
    },
    valuation: [
      {
        title: "Storage and daily-use features",
        text: "Make the seat and storage areas accessible and note problems with opening mechanisms or controls. Tell the team about damaged trim and any accessory fittings. Avoid using a current model's storage or feature claims to describe an older scooter with different equipment.",
      },
      {
        title: "Service and moving-off behaviour",
        text: "Share belt, clutch and other service records available for your Jupiter. Explain vibration, hesitation or starting concerns you have observed and whether they happen from cold or after riding. This helps organise the inspection without claiming a diagnosis from symptoms alone.",
      },
      {
        title: "Brakes, tyres and operating pattern",
        text: "Identify recent replacements and any unresolved handling concerns. Explain whether use has been a daily commute, short family errands or business work. Mention long idle periods and battery work instead of allowing low mileage to imply continuous maintenance.",
      },
    ],
    checklist: [
      "Confirm Jupiter 110 or 125 and the model year.",
      "Locate keys and make storage compartments accessible.",
      "Collect automatic-drive and brake service records.",
      "Describe changes to original controls, displays or body panels.",
    ],
    visit:
      "If the Jupiter is kept in shared Bangalore two-wheeler parking, arrange permission to move it into an accessible spot. Have the owner or someone familiar with its daily operation available to explain intermittent faults and maintenance.",
    faqs: [
      {
        question: "Should I use the same description for Jupiter 110 and 125?",
        answer:
          "No. Identify the actual model, generation and year. Equipment and configuration can differ, so the precise version is needed.",
      },
      {
        question: "Do I need to empty the Jupiter's storage for inspection?",
        answer:
          "Yes, remove personal belongings so the compartment and its operation can be seen. Keep vehicle records available separately for discussion.",
      },
      {
        question: "Can I enquire if my Jupiter does not currently start?",
        answer:
          "Explain the condition and any known diagnosis before scheduling. The team must confirm eligibility and whether the proposed inspection can be carried out at its location.",
      },
    ],
  },
  "suzuki-access-125": {
    description:
      "Sell your Suzuki Access 125 in Bangalore. Prepare variant, service and equipment details, and book a free doorstep inspection to discuss your offer.",
    intro:
      "Your Access 125's version, upkeep and daily-use condition are the starting points for a useful sale discussion. Bring together the scooter's records, keys and an honest account of repairs. Request a Bangalore inspection and decide after the team explains the offer.",
    focus: "Variant equipment and service evidence",
    identity: {
      title: "Identify your Access 125 variant",
      text: "Use the model year and variant from your records. Displays, braking equipment and other features differ across versions, so describe what is on your own scooter. This guide concerns Access 125; if you mean the electric e-ACCESS, tell the team explicitly so the enquiry is handled appropriately.",
    },
    valuation: [
      {
        title: "Original equipment and connected features",
        text: "List any replaced display, lights or controls and note faults with fitted electronics. For connected features, ask how to remove your personal association after a sale is agreed. Do not hand over personal account passwords as part of an initial inspection.",
      },
      {
        title: "Engine and automatic-drive servicing",
        text: "Bring available records of routine maintenance, belt or clutch work. Explain starting difficulty, vibration or any workshop advice you received. Do not replace parts solely to make the scooter appear ready for sale without first understanding the cost and the inspection needs.",
      },
      {
        title: "Seat, bodywork and practical condition",
        text: "Check seat access, panel repairs, mirrors and storage locks. If the scooter carried deliveries or bulky items, disclose that use and associated wear. Clarify whether guards, racks or other removable additions are part of the vehicle being offered.",
      },
    ],
    checklist: [
      "Check the Access 125 year and full variant name.",
      "Gather service invoices and locate spare keys.",
      "List changed electronics and any connected features fitted.",
      "Empty storage and identify removable accessories included.",
    ],
    visit:
      "For an Access used on a Bangalore commute, arrange the visit when it can stay parked long enough for inspection. Share gate instructions and have the keys available for storage access; mention non-running condition before anyone plans to move it.",
    faqs: [
      {
        question: "Is this the right page for an electric e-ACCESS?",
        answer:
          "This page focuses on Access 125. Contact the team with the exact electric model and condition to confirm eligibility and the appropriate assessment.",
      },
      {
        question: "Should I share an app password during the Access inspection?",
        answer:
          "No. Explain which connected features are fitted and discuss the account-disassociation process after agreeing the sale. Personal passwords are not a vehicle condition record.",
      },
      {
        question: "Do guards or a luggage rack automatically add to the offer?",
        answer:
          "No fixed extra amount is promised. List the accessories and agree whether they stay with the scooter so the offer and handover cover the same items.",
      },
    ],
  },
};
