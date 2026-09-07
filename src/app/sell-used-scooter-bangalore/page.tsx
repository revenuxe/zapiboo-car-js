import VehicleSelling, { sellingMetadata } from "@/views/vehicle-selling";

export const metadata = sellingMetadata("scooter");

export default function Page() {
  return <VehicleSelling vehicle="scooter" />;
}
