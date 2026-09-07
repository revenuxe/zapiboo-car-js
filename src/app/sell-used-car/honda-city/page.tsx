import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("honda-city");

export default function Page() {
  return <ModelSelling slug="honda-city" />;
}
