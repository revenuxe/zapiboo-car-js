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
