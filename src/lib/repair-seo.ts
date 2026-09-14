import { absoluteUrl, breadcrumbSchema, businessContact, faqSchema, siteUrl } from "@/lib/seo";
import { repairServices, type RepairService } from "@/lib/repair-services";

export const repairHomepageFaqs = [
  {
    question: "How do I request a repair?",
    answer:
      "Select your vehicle category, choose View Service, then complete the booking enquiry form. Share your model, year, locality and the issue you are facing so the team can discuss the next step.",
  },
  {
    question: "How much will the service cost?",
    answer:
      "The cost depends on the vehicle, diagnosis, parts and work required. Ask the team for an estimate and confirm the scope before agreeing to repairs.",
  },
  {
    question: "Can I enquire for an electric vehicle?",
    answer:
      "Yes. Select EV and describe the issue, including the make and model. The team will need to confirm whether the required EV work can be supported.",
  },
  {
    question: "Is pickup or doorstep service available?",
    answer:
      "Share your Bangalore locality and the service you need. The team will confirm available arrangements, timings and any associated charges before you proceed.",
  },
] as const;

export const repairServiceFaqs = [
  {
    question: "Is the starting price my final price?",
    answer:
      "Your model, engine capacity, condition and required parts can change the total. Review the final estimate before approving the work.",
  },
  {
    question: "Are parts and consumables included?",
    answer:
      "Do not assume parts, oil, filters or other consumables are included. The team will confirm these items and charges in your estimate.",
  },
  {
    question: "How long will it take?",
    answer:
      "Timing depends on the vehicle, diagnosis and parts availability. Confirm the appointment and expected completion time with the team.",
  },
] as const;

export function repairHomepageSchema() {
  const url = absoluteUrl("/repair");
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: "Vehicle repair and servicing in Bangalore",
      serviceType: "Vehicle servicing and repair",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: { "@type": "City", name: "Bangalore" },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#services`,
      name: "Zapiboo vehicle services",
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: repairServices.length,
      itemListElement: repairServices.map((service, position) => ({
        "@type": "ListItem",
        position: position + 1,
        name: service.serviceName,
        url: absoluteUrl(service.landingPageUrl),
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Vehicle repair", path: "/repair" },
    ]),
    faqSchema(repairHomepageFaqs),
  ];
}

export function repairServiceSchema(service: RepairService) {
  const url = absoluteUrl(service.landingPageUrl);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: `${service.serviceName} in Bangalore`,
      description: service.description,
      serviceType: service.serviceName,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: { "@type": "City", name: "Bangalore" },
      audience: { "@type": "Audience", audienceType: service.vehicleCategory },
      url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: businessContact.phoneHref.replace("tel:", ""),
        contactType: "customer service",
      },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Vehicle repair", path: "/repair" },
      { name: service.serviceName, path: service.landingPageUrl },
    ]),
    faqSchema(repairServiceFaqs),
  ];
}
