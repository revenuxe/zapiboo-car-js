import VehicleSelling, { sellingMetadata } from "@/views/vehicle-selling";

export const metadata = sellingMetadata("commercial");

export default function Page() {
  return <VehicleSelling vehicle="commercial" />;
}
