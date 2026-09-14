import RepairHome from "@/views/repair";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/repair",
  "Vehicle Repair & Service Enquiries in Bangalore | Zapiboo",
  "Explore servicing and repair options for cars, bikes, scooters and more in Bangalore. Choose your vehicle and service to enquire with Zapiboo.",
);

export default function Page() {
  return <RepairHome />;
}
