import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("suzuki-access-125");

export default function Page() {
  return <ModelSelling slug="suzuki-access-125" />;
}
