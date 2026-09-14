import RepairHome from "@/views/repair";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { repairHomepageSchema } from "@/lib/repair-seo";

export const metadata = pageMetadata(
  "/repair",
  "Vehicle Repair & Service Enquiries in Bangalore | Zapiboo",
  "Explore servicing and repair options for cars, bikes, scooters and more in Bangalore. Choose your vehicle and service to enquire with Zapiboo.",
);

export default function Page() {
  return (
    <>
      <JsonLd data={repairHomepageSchema()} />
      <RepairHome />
    </>
  );
}
