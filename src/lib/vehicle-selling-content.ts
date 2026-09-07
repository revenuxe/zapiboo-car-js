import type { SellingVehicle } from "./vehicle-selling-links";

type Topic = { title: string; text: string };
export type SellingContent = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  kicker: string;
  imageAlt: string;
  booking: "car" | "bike" | "scooter" | "commercial";
  cta: string;
  bookingHint: string;
  overview: Topic;
  factorsTitle: string;
  factors: Topic[];
  preparationTitle: string;
  preparation: string[];
  documents: Topic;
  local: Topic;
  steps: Topic[];
  faqs: { question: string; answer: string }[];
};

export const vehicleSellingContent: Record<SellingVehicle, SellingContent> = {
  car: {
    title: "Sell Used Car in Bangalore | Doorstep Inspection | Zapiboo",
    description:
      "Selling a hatchback or sedan in Bangalore? Understand your car's value, prepare service records and book a free doorstep inspection with Zapiboo.",
    heading: "Sell your used car in Bangalore",
    kicker: "Your next chapter starts here",
    intro:
      "An upgrade, a move, or a car that spends more time parked than driven: whatever brings you here, start with a clear assessment. Share your hatchback or sedan's details, arrange a free doorstep inspection and review an offer based on the vehicle you actually own.",
    imageAlt: "Red hatchback illustrating the used car selling service",
    booking: "car",
    cta: "Book my car inspection",
    bookingHint:
      "Choose your car's body style and brand in the booking flow. An inspection request does not generate an instant price.",
    overview: {
      title: "A useful car valuation starts with the exact variant",
      text: "A model name alone leaves out much of the story. An automatic petrol hatchback and a manual version of the same model can have different equipment, maintenance needs and buyer appeal. Bring the variant, registration year, odometer reading and service history into the conversation. Your original purchase price or a similar car's advertised asking price is context, rather than a promise of what your car will sell for.",
    },
    factorsTitle: "What helps explain your hatchback or sedan's value?",
    factors: [
      {
        title: "How the car has been driven",
        text: "Describe regular commuting, occasional family trips or long periods of storage. Kilometres matter alongside the kind of use and maintenance. If the car has stood unused, mention starting trouble, a weak battery or overdue servicing before the visit.",
      },
      {
        title: "Transmission and everyday features",
        text: "Tell the team whether the car is manual, AMT, CVT or another automatic type, if you know. Note warning lights, unusual gear changes and air-conditioning faults. Working features and a clear account of problems make the inspection discussion more productive.",
      },
      {
        title: "Bodywork and repair history",
        text: "Separate minor parking scratches from larger repairs when describing the car. Share invoices for replaced panels or mechanical work where available. Do not guess about previous-owner repairs; explain which parts of the history you can actually document.",
      },
      {
        title: "Ownership and maintenance records",
        text: "Keep service dates, tyre replacements and major repair bills in order. If the registered owner is a family member, say so before planning handover. An incomplete service book does not tell the whole story, so bring any individual invoices you still have.",
      },
    ],
    preparationTitle: "Prepare your car without spending on a makeover",
    preparation: [
      "Clear the boot and cabin so storage areas and interior condition can be seen.",
      "Keep the main key, spare key and service folder together.",
      "Write down warning lights, fluid leaks or intermittent issues you want to explain.",
      "Choose an accessible parking space and share apartment entry instructions.",
      "Discuss major repair plans before paying for work solely to improve the sale price.",
    ],
    documents: {
      title: "Put the vehicle's history in one folder",
      text: "Have the registration certificate, insurance information and available service records ready for discussion. Mention an active loan, a missing original or a mismatch in owner details early. Ask the team for the checklist that applies to your transaction and confirm finance-related requirements with your lender. Keep copies of the agreed offer, payment confirmation and handover record.",
    },
    local: {
      title: "Plan an inspection around your Bangalore routine",
      text: "For an office visit in Whitefield or an apartment visit in HSR Layout, the practical details matter: where the car is parked, who can provide access and when you will have the keys. Enter the actual inspection address and pincode when booking. Check available slots for your location, and mention basement parking or visitor-entry requirements before the appointment.",
    },
    steps: [
      {
        title: "Identify your car",
        text: "Choose the body style and brand, then add the model and year. Describe your car accurately so the team can prepare.",
      },
      {
        title: "Arrange a free inspection",
        text: "Provide your Bangalore address and choose an available slot. Have the car, keys and records accessible for the visit.",
      },
      {
        title: "Review the complete sale arrangement",
        text: "Ask about the offer, payment, handover and RC transfer support. Proceed when you understand and accept the arrangements.",
      },
    ],
    faqs: [
      {
        question: "Does entering my car details give me an instant price?",
        answer:
          "No. Booking starts an inspection request. The team needs to review the car and its condition before discussing an offer; a registration number alone is not an automatic valuation.",
      },
      {
        question: "Should I repaint parking scratches before selling?",
        answer:
          "Describe the scratches and let the team assess the car first. Cosmetic work costs money and may not add the same amount to an offer. Keep any existing repair invoices available.",
      },
      {
        question: "Can I start if my car is registered outside Karnataka?",
        answer:
          "Contact the team with the registration state, age and current location before arranging the visit. Acceptance and any additional paperwork need to be confirmed for the particular car.",
      },
      {
        question: "What if I am selling because I am leaving Bangalore?",
        answer:
          "Share your departure date early and ask what can realistically be completed before then. An inspection slot is not a guaranteed sale completion date. Allow time for the offer discussion, documents and handover.",
      },
      {
        question: "Where should I start for an SUV?",
        answer:
          "Use the SUV selling guide for advice on drivetrain, seating, tyre condition and larger-vehicle inspection access. The booking flow places SUVs under the Car category.",
      },
    ],
  },
  bike: {
    title: "Sell Used Bike in Bangalore | Motorcycle Valuation | Zapiboo",
    description:
      "Sell your used bike in Bangalore with a free inspection. Prepare motorcycle service history, explain modifications and understand what shapes your offer.",
    heading: "Sell your used bike in Bangalore",
    kicker: "From daily commute to the next ride",
    intro:
      "Moving on from a commuter motorcycle, a weekend cruiser or a sports bike? Give the next conversation more substance than a model name and an asking price. Zapiboo helps you start with bike details, a free doorstep inspection and an offer you can review before deciding.",
    imageAlt: "Motorcycle illustrating the used bike selling service",
    booking: "bike",
    cta: "Book my bike inspection",
    bookingHint:
      "Select Bike, then the matching bike type and brand. Share the model and year to prepare for the visit.",
    overview: {
      title: "Your motorcycle's upkeep deserves a closer look",
      text: "Two bikes of the same age can have very different stories. One may have covered a regular commute with scheduled maintenance; another may have spent months between rides. Explain how yours has been used, how often it has been serviced and what has been replaced. For a modified bike, distinguish the original specification from the parts currently fitted.",
    },
    factorsTitle: "Bike-specific details that make the assessment clearer",
    factors: [
      {
        title: "Starting, engine and gearbox behaviour",
        text: "Mention difficult starts, stalling, unusual smoke, oil leaks or awkward gear changes. Describe when a symptom happens instead of trying to diagnose it yourself. Recent workshop invoices help explain completed work and any issues still unresolved.",
      },
      {
        title: "Chain, sprockets and clutch",
        text: "If you know when the chain set or clutch was last replaced, bring that record. Tell the team about noises, slipping or adjustments that do not last. These parts give useful context about maintenance beyond the odometer reading.",
      },
      {
        title: "Tyres, brakes and suspension",
        text: "Note tyre replacements, brake work, fork leaks or damage from a fall. A low-speed drop and a major accident are different histories; describe yours honestly and share repair bills. Avoid covering damaged parts before the inspection.",
      },
      {
        title: "Accessories and modifications",
        text: "List aftermarket exhausts, lights, handlebars, luggage racks or engine changes. Say whether original parts are included. Accessories do not automatically add their purchase cost to the offer, and the team needs to review the bike as it is configured.",
      },
    ],
    preparationTitle: "A short checklist before the motorcycle visit",
    preparation: [
      "Park where both sides of the bike can be inspected with room to move around it.",
      "Have the key, spare key and service invoices ready.",
      "Tell the inspector if the bike has not been started or ridden recently.",
      "List fitted accessories and decide which removable items are included in the sale.",
      "Explain known riding or braking problems before anyone moves the motorcycle.",
    ],
    documents: {
      title: "Keep the bike's records connected to its identity",
      text: "Gather registration and insurance information with maintenance receipts, especially for substantial engine work or replacement parts. Explain any owner-name discrepancy or active finance before agreeing to a sale. Confirm the required documents with the team rather than relying on another rider's checklist. At handover, record the bike, keys and accessories being passed on.",
    },
    local: {
      title: "Make room for an inspection, even in a busy parking area",
      text: "A motorcycle parked tightly between two-wheelers can be hard to assess. At your home or workplace in Bangalore, arrange permission to move it into an accessible space and share the gate or parking landmark. Use the address where the bike will actually be available, whether that is in Koramangala, Marathahalli or another locality. Appointment availability is checked during booking.",
    },
    steps: [
      {
        title: "Describe the motorcycle",
        text: "Choose the bike type and brand, enter the model and year, and be ready to explain its use and modifications.",
      },
      {
        title: "Show its condition",
        text: "Arrange an available doorstep visit with access to the bike and records. Point out repairs and unresolved issues.",
      },
      {
        title: "Agree what is included",
        text: "Review the offer and specify accessories, keys, payment and transfer arrangements before the bike changes hands.",
      },
    ],
    faqs: [
      {
        question: "Can I enquire about a sports bike or cruiser?",
        answer:
          "Yes. Start with the Bike category and share the exact model. Confirm eligibility and inspection arrangements with the team for specialist or less common motorcycles.",
      },
      {
        question: "Will an aftermarket exhaust increase my offer?",
        answer:
          "There is no automatic increase. Share the exhaust details and whether the original is available. The assessment considers the whole motorcycle, including its condition and modifications.",
      },
      {
        question: "My bike has been unused for months. What should I say?",
        answer:
          "Tell the team how long it has been parked and whether it starts. Mention battery, fuel or maintenance issues you know about so the visit can be planned appropriately. Do not present it as regularly running if it is not.",
      },
      {
        question: "Do I need to include my helmet and riding gear?",
        answer:
          "Discuss removable items separately. List exactly what is included in the agreed sale; personal riding gear should not be assumed to be part of the motorcycle offer.",
      },
      {
        question: "Can a bike with previous accident repairs be assessed?",
        answer:
          "Disclose the repairs and provide available invoices or photographs when speaking with the team. They will need to confirm whether the particular bike can be accepted and inspected.",
      },
    ],
  },
  scooter: {
    title: "Sell Used Scooter in Bangalore | Petrol & Electric | Zapiboo",
    description:
      "Selling a petrol or electric scooter in Bangalore? Prepare service records, keys and charger details, then request a free doorstep inspection with Zapiboo.",
    heading: "Sell your used scooter in Bangalore",
    kicker: "A simpler handover for your everyday ride",
    intro:
      "Your scooter may have handled office runs, college trips and everyday errands. When it is time to sell, its condition and maintenance tell a more useful story than age alone. Start a free inspection request for your petrol or electric scooter and discuss an offer after the team reviews it.",
    imageAlt: "Scooter illustrating the used scooter selling service",
    booking: "scooter",
    cta: "Book my scooter inspection",
    bookingHint:
      "Choose the scooter type and brand in booking. For an electric model, have battery and charger information ready.",
    overview: {
      title: "Petrol and electric scooters need different conversations",
      text: "For a petrol scooter, describe starting behaviour, servicing and how it feels when pulling away. For an electric scooter, explain charging, the battery arrangement and the range you experience in normal use. Keep the exact variant handy: scooters with similar names can have different batteries or equipment. Tell the team which version you own rather than selecting the nearest familiar name.",
    },
    factorsTitle: "What to share about your scooter",
    factors: [
      {
        title: "Petrol engine and automatic drive",
        text: "Mention starting difficulty, vibration, unusual sounds or hesitation when moving off. Keep records of belt, clutch or other transmission work if available. Explain whether problems happen from cold, after a longer ride or only occasionally.",
      },
      {
        title: "Electric battery and charging",
        text: "Gather available battery-health reports, replacement invoices and warranty information. Describe the range you observe and the conditions in which you ride, without presenting it as a guaranteed range. Note charging faults, missing equipment or a battery subscription arrangement.",
      },
      {
        title: "Panels, storage and daily-use parts",
        text: "Show cracked panels, seat tears, damaged mirrors and problems with the under-seat lock. Check that you can open the storage area and fuel or charging access. Small everyday faults are easier to discuss when they are listed together.",
      },
      {
        title: "Usage and consumables",
        text: "Explain whether the scooter served short household trips, a daily commute or delivery work. Share recent tyre, brake and battery replacements. The pattern of use gives context to the odometer and helps avoid assumptions based only on appearance.",
      },
    ],
    preparationTitle: "Have the keys, storage and charging kit ready",
    preparation: [
      "Empty the under-seat compartment and front storage pockets.",
      "Keep all keys or key fobs together and mention any missing spare.",
      "For an electric scooter, make the charger and relevant account information available for discussion.",
      "List faults in the display, lights, seat lock or charging access.",
      "Share the scooter's actual location and whether it can currently be moved.",
    ],
    documents: {
      title: "Prepare for more than a key handover",
      text: "Bring registration, insurance and service information, plus battery or charger purchase records for an electric model where available. Tell the team if equipment is financed, leased or provided through a subscription. Ask how any manufacturer-app association or connected account should be handled after the sale is agreed; avoid sharing account passwords. Confirm the transaction-specific paperwork before handover.",
    },
    local: {
      title: "Selling a family scooter while keeping the day moving",
      text: "If several people at home use the scooter, choose a Bangalore inspection slot when it will be parked and the keys will be available. For apartment complexes in Bellandur or JP Nagar, share visitor access instructions and the correct block. For a scooter kept at work, check that an inspection is permitted there. Enter your pincode to review appointment availability.",
    },
    steps: [
      {
        title: "Identify the scooter version",
        text: "Add the type, brand, model and year. Make clear whether it is petrol or electric and describe the battery arrangement where relevant.",
      },
      {
        title: "Prepare an accessible visit",
        text: "Choose an available inspection slot and gather keys, records and charging equipment so the scooter can be reviewed.",
      },
      {
        title: "Settle the handover details",
        text: "Review the offer, included equipment and payment arrangements. Ask about RC transfer support and any connected-account steps.",
      },
    ],
    faqs: [
      {
        question: "Can I enquire about selling an electric scooter?",
        answer:
          "Yes. Share the brand, exact model, battery details and current condition. The team must confirm eligibility and how your model can be assessed; a booking request does not guarantee acceptance.",
      },
      {
        question: "What if the charger or spare key is missing?",
        answer:
          "Mention the missing item before the inspection. The team needs to know what equipment is available and what would be included in a sale. Do not buy a replacement solely for the sale without discussing it first.",
      },
      {
        question: "Should I quote the advertised range of my electric scooter?",
        answer:
          "Share the exact variant and describe the range you personally observe, with context such as riding pattern and load. Manufacturer figures and your actual experience are different pieces of information; neither replaces a battery assessment.",
      },
      {
        question: "Can I sell a scooter used for deliveries?",
        answer:
          "Tell the team about delivery use, distance covered, servicing and any changes to the scooter. They can confirm eligibility after reviewing those details. An accurate usage history is more useful than describing every scooter as privately commuted.",
      },
      {
        question: "Is a scooter inspection an obligation to sell?",
        answer:
          "No. You can review the offer and ask about the assessment before deciding. Agree on payment, paperwork and included keys or charging equipment only when you are ready to proceed.",
      },
    ],
  },
  suv: {
    title: "Sell Used SUV in Bangalore | SUV Inspection | Zapiboo",
    description:
      "Sell your used SUV in Bangalore. Explain its drivetrain, seating, maintenance and usage, and book a free doorstep inspection to discuss a market-linked offer.",
    heading: "Sell your used SUV in Bangalore",
    kicker: "The details behind the bigger picture",
    intro:
      "A compact crossover, a seven-seat family SUV and a four-wheel-drive tourer need different assessments. Share the specification and history of yours, book a free doorstep inspection and discuss an offer with the details in view.",
    imageAlt: "SUV illustrating the sport utility vehicle selling service",
    booking: "car",
    cta: "Book my SUV inspection",
    bookingHint:
      "SUVs are listed under Car in our booking flow. Choose SUV as the body style on the next step.",
    overview: {
      title: "An SUV badge does not describe the whole vehicle",
      text: "The same model may come with different seating layouts, engines, gearboxes and drive systems. Identify your exact variant and whether it is two-wheel drive, all-wheel drive or four-wheel drive, if known. Describe school runs, highway journeys, towing or off-road use honestly. Those details help the team understand what to review instead of treating every SUV as the same kind of family car.",
    },
    factorsTitle: "SUV details worth bringing into the valuation",
    factors: [
      {
        title: "Drivetrain and transmission history",
        text: "Bring records of gearbox or drive-system servicing and mention warning lights or unusual sounds. If your SUV has selectable drive modes or four-wheel-drive controls, point out any known faults. Do not assume a higher-spec badge proves which system is fitted.",
      },
      {
        title: "Suspension, tyres and underbody",
        text: "Explain suspension repairs, uneven tyre wear, underbody impacts or damage from rough roads. Tell the team about changed wheel sizes or lift kits. Larger tyres and accessories can be expensive, but their retail cost is not automatically recovered in the sale offer.",
      },
      {
        title: "Seating and cabin equipment",
        text: "Confirm the seating configuration and whether folding seats, rear air-conditioning, sunroof and powered features work. For a family SUV, show wear across all rows rather than only the front seats. Include missing headrests, trim or parcel shelves in your description.",
      },
      {
        title: "Long journeys and maintenance",
        text: "Use service invoices to explain major work and the maintenance schedule actually followed. For a diesel SUV, mention any emissions-system warning or related workshop visit. For a hybrid or electric SUV, gather available battery and warranty records.",
      },
    ],
    preparationTitle: "Leave space to see the whole SUV",
    preparation: [
      "Park where doors and the tailgate can open without blocking neighbouring vehicles.",
      "Make all seating rows and the boot accessible by removing personal luggage.",
      "Locate spare keys and any removable accessories included in the sale.",
      "Collect invoices for tyres, suspension, transmission and significant repairs.",
      "Share parking-height restrictions or tight access before the inspector arrives.",
    ],
    documents: {
      title: "Explain the specification as well as the paperwork",
      text: "Keep the registration certificate, insurance information and service history with any invoices that identify the exact variant or installed equipment. Mention finance and ownership details early. List roof racks, additional wheels or other removable items separately so the agreed offer has a clear scope. Confirm payment, transfer support and the handover record before releasing the vehicle.",
    },
    local: {
      title: "A Bangalore visit with enough room for a larger vehicle",
      text: "Basement bays and narrow apartment driveways can make an SUV harder to inspect. When booking in Hebbal, Yelahanka, Sarjapur Road or elsewhere in Bangalore, identify an accessible parking location and provide entry instructions. If the vehicle is usually away on family or work trips, choose a slot when it will be back at that address. The team confirms availability for your location.",
    },
    steps: [
      {
        title: "Choose Car, then SUV",
        text: "Start in the Car booking category and select the SUV body style. Add your brand, model and year.",
      },
      {
        title: "Share the specification and history",
        text: "Prepare drivetrain, seating and maintenance details for the doorstep inspection. Explain modifications and known damage.",
      },
      {
        title: "Review the offer and included equipment",
        text: "Clarify which accessories stay with the SUV, then agree on payment, handover and ownership-transfer arrangements.",
      },
    ],
    faqs: [
      {
        question: "Why does the SUV booking button open the Car category?",
        answer:
          "The booking catalogue groups SUVs under Car. Choose SUV on the body-style step, then continue with the brand and vehicle details.",
      },
      {
        question: "Does four-wheel drive always mean a higher sale price?",
        answer:
          "No fixed premium can be promised. The exact variant, working condition, service history and demand all matter. Tell the team which drive system is fitted and share relevant maintenance records.",
      },
      {
        question: "Should I disclose off-road use?",
        answer:
          "Yes. Describe how the SUV was used and any underbody, suspension or body repairs. Clear history helps the team assess the vehicle and avoids surprises during the inspection.",
      },
      {
        question: "Can you assess a seven-seat family SUV?",
        answer:
          "Share the model and seating configuration when enquiring. Prepare access to every row and mention faults with seats or rear cabin equipment. Eligibility is confirmed for your particular vehicle.",
      },
      {
        question: "Are roof racks and extra wheels part of the offer?",
        answer:
          "Only include them if that is what you agree with the team. Make a written list of removable equipment that stays with the vehicle and discuss its treatment before accepting the offer.",
      },
    ],
  },
  commercial: {
    title: "Sell Commercial Vehicle in Bangalore | Inspection | Zapiboo",
    description:
      "Sell a commercial vehicle in Bangalore with a clearer plan. Share its working history, body configuration and records, then request a doorstep inspection.",
    heading: "Sell your commercial vehicle in Bangalore",
    kicker: "Plan the sale around your business",
    intro:
      "Replacing a delivery vehicle, retiring an auto or reducing a working fleet takes more planning than handing over the keys. Tell Zapiboo what the vehicle carries, how it has worked and when it can be inspected. Start a free inspection request and confirm eligibility for your specific vehicle with the team.",
    imageAlt: "Commercial vehicle illustrating the business vehicle selling service",
    booking: "commercial",
    cta: "Request a commercial vehicle inspection",
    bookingHint:
      "Choose Commercial, then the available vehicle type. For a fleet or unusual body configuration, speak to the team before scheduling.",
    overview: {
      title: "Value the working vehicle, not just the chassis badge",
      text: "A cargo auto, delivery van, pickup and truck have different uses and inspection needs. Describe the vehicle's body, capacity as recorded in its documents, route pattern and typical work. Include fitted equipment and say whether it will stay with the vehicle. A clear description lets the team confirm suitability before you take a vehicle out of service for a visit.",
    },
    factorsTitle: "The commercial details that shape the discussion",
    factors: [
      {
        title: "Duty cycle and operating history",
        text: "Explain city deliveries, longer-distance trips, frequent stops or extended idle periods. Bring odometer readings and available operating or maintenance logs. If a vehicle has changed jobs during your ownership, describe both periods rather than only its most recent route.",
      },
      {
        title: "Load body and fitted equipment",
        text: "Identify an open body, enclosed box, passenger layout or specialist installation. Note damage, corrosion, repairs and alterations. List equipment such as a refrigeration unit separately and confirm whether it is owned, financed or excluded from the sale.",
      },
      {
        title: "Mechanical upkeep and downtime",
        text: "Gather records of major engine, clutch, gearbox, brake and suspension work. Explain recurring faults and any current limitation on driving or loading. Maintenance history helps distinguish completed repairs from work a new operator may still need to arrange.",
      },
      {
        title: "Business ownership and vehicle records",
        text: "Tell the team whether the registered owner is an individual or a business, and who can authorise a sale. Share available permit, fitness, tax, insurance and finance information for review. The applicable requirements need confirmation for the vehicle and proposed transaction.",
      },
    ],
    preparationTitle: "Prepare a visit without disrupting a working route",
    preparation: [
      "Choose a time when the vehicle is back from duty and can be made available.",
      "Unload goods and remove customer property before inspection.",
      "Arrange yard or premises access with space around the body and cab.",
      "Have the responsible owner or authorised representative available for questions.",
      "Separate included equipment from tools, stock and removable business assets.",
      "Explain any non-running condition before planning movement or collection.",
    ],
    documents: {
      title: "Review the transaction before taking the vehicle off duty",
      text: "Start with registration, insurance and service records, plus available operating documents relevant to the vehicle. If it belongs to a company, clarify who will approve the transaction and provide the ownership records. For an active loan or leased equipment, confirm the process with the relevant lender or owner. Ask the team to agree a vehicle-specific checklist, payment terms and handover responsibilities before scheduling your final working day.",
    },
    local: {
      title: "Coordinate a Bangalore yard, depot or workplace inspection",
      text: "For a vehicle based in Peenya, Bommasandra or another working area, share the actual yard address, gate contact and access restrictions. A business mailing address may not be where the vehicle is parked. If the vehicle runs outside Bangalore, identify when it will return and check slot availability before changing its schedule. Discuss fleet enquiries individually so each vehicle's records and condition are reviewed.",
    },
    steps: [
      {
        title: "Describe the vehicle and its work",
        text: "Select the commercial category, add the model and year, and explain the body configuration and current operating condition.",
      },
      {
        title: "Confirm eligibility and inspection access",
        text: "Check the specific vehicle with the team and arrange a visit when it is available, unloaded and accessible.",
      },
      {
        title: "Agree a business-ready handover",
        text: "Review the offer, included equipment, ownership documents and payment arrangements. Coordinate the handover with your operating schedule.",
      },
    ],
    faqs: [
      {
        question: "Which commercial vehicles can I enquire about?",
        answer:
          "The booking flow includes a Commercial category for enquiries such as autos, pickups, tempos and trucks. Share the exact type, model, body and condition; the team must confirm acceptance for each vehicle.",
      },
      {
        question: "Can I sell more than one business vehicle?",
        answer:
          "Contact the team with a separate list of models, registration details, locations and conditions. Ask how the inspections and paperwork should be organised. A fleet enquiry does not imply one shared valuation for every vehicle.",
      },
      {
        question: "What if the vehicle is financed or company-owned?",
        answer:
          "Explain the ownership and finance arrangement before accepting an offer. Confirm authorisation and lender-related steps with the relevant parties, and agree the transaction-specific document checklist with the team.",
      },
      {
        question: "Can I keep the vehicle working until the sale?",
        answer:
          "Discuss your operating schedule and proposed handover date with the team. Any change in condition or mileage after inspection should be disclosed. Do not assume an inspection appointment fixes the final collection or payment date.",
      },
      {
        question: "Can I enquire about a non-running commercial vehicle?",
        answer:
          "Yes, but clearly describe the fault and whether the vehicle can be moved. Eligibility, inspection access and any movement arrangements need to be confirmed before a visit is scheduled.",
      },
      {
        question: "Should I remove branding or specialist equipment first?",
        answer:
          "Discuss what is included before altering the vehicle. Identify business branding, installed equipment and leased items so removal, inclusion and handover responsibilities can be agreed explicitly.",
      },
    ],
  },
};
