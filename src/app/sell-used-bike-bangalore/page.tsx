import VehicleSelling, { sellingMetadata } from "@/views/vehicle-selling";

export const metadata = sellingMetadata("bike");

export default function Page() {
  return <VehicleSelling vehicle="bike" />;
}
