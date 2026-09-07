import VehicleSelling, { sellingMetadata } from "@/views/vehicle-selling";

export const metadata = sellingMetadata("suv");

export default function Page() {
  return <VehicleSelling vehicle="suv" />;
}
