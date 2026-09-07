import VehicleSelling, { sellingMetadata } from "@/views/vehicle-selling";

export const metadata = sellingMetadata("car");

export default function Page() {
  return <VehicleSelling vehicle="car" />;
}
