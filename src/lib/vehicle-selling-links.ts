export const vehicleSellingLinks = [
  { key: "car", label: "Sell used car in Bangalore", path: "/sell-used-car-bangalore" },
  { key: "bike", label: "Sell used bike in Bangalore", path: "/sell-used-bike-bangalore" },
  { key: "scooter", label: "Sell used scooter in Bangalore", path: "/sell-used-scooter-bangalore" },
  { key: "suv", label: "Sell used SUV in Bangalore", path: "/sell-used-suv-bangalore" },
  {
    key: "commercial",
    label: "Sell commercial vehicle in Bangalore",
    path: "/sell-commercial-vehicle-bangalore",
  },
] as const;

export type SellingVehicle = (typeof vehicleSellingLinks)[number]["key"];
