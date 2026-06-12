import { serviceLocalities } from "@/lib/bangalore-data";

export const siteUrl = "https://doorstep-delight.vercel.app";

export const businessContact = {
  name: "HuluMart",
  phone: "9886285028",
  phoneHref: "tel:+919886285028",
  email: "hulumart.com@gmail.com",
  emailHref: "mailto:hulumart.com@gmail.com",
  address: "HBR Layout, Bangalore, 560043",
  locality: "HBR Layout",
  city: "Bangalore",
  region: "Karnataka",
  postalCode: "560043",
  country: "IN",
};

export type ServiceArea = {
  name: string;
  slug: string;
  pincode: string;
  nearby: string[];
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const nearbyByArea: Record<string, string[]> = {
  Whitefield: ["Brookefield", "Kadugodi", "ITPL"],
  "Electronic City": ["Neeladri Nagar", "Hosa Road", "Bommasandra"],
  "HSR Layout": ["Agara", "Sector 1", "Sector 7"],
  Koramangala: ["Ejipura", "Sony World", "Jakkasandra"],
  Marathahalli: ["Kundalahalli", "Munnekollal", "HAL Road"],
  Indiranagar: ["Domlur", "Old Airport Road", "CMH Road"],
  "JP Nagar": ["Jayanagar", "Bannerghatta Road", "Puttenahalli"],
  Hebbal: ["Manyata Tech Park", "Kempapura", "Sahakar Nagar"],
  Yelahanka: ["Jakkur", "Kogilu", "New Town"],
  Jayanagar: ["Basavanagudi", "South End Circle", "4th Block"],
  Banashankari: ["Kathriguppe", "Padmanabhanagar", "Uttarahalli"],
  "Sarjapur Road": ["Kaikondrahalli", "Doddakannelli", "Carmelaram"],
};

export const serviceAreas: ServiceArea[] = serviceLocalities.map((area) => ({
  name: area.name,
  slug: toSlug(area.name),
  pincode: area.pincode,
  nearby: nearbyByArea[area.name] ?? [],
}));

export const featuredServiceAreas = [
  "whitefield",
  "electronic-city",
  "hsr-layout",
  "koramangala",
  "marathahalli",
  "indiranagar",
  "jp-nagar",
  "hebbal",
  "yelahanka",
  "jayanagar",
  "banashankari",
  "sarjapur-road",
];

export function getAreaBySlug(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: businessContact.name,
    url: absoluteUrl(path),
    email: businessContact.email,
    telephone: `+91${businessContact.phone}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessContact.locality,
      addressLocality: businessContact.city,
      addressRegion: businessContact.region,
      postalCode: businessContact.postalCode,
      addressCountry: businessContact.country,
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "Place",
      name: `${area.name}, Bangalore`,
    })),
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Doorstep scrap collection in Bangalore",
      },
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: businessContact.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/materials?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceSchema(path: string, area?: ServiceArea) {
  const name = area
    ? `Scrap buyers in ${area.name}, Bangalore`
    : "Doorstep scrap collection in Bangalore";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType: "Scrap buying and doorstep scrap collection",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: {
      "@type": "Place",
      name: area ? `${area.name}, Bangalore` : "Bangalore",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url: absoluteUrl(path),
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
