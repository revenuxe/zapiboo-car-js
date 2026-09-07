import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("tata-nexon");

export default function Page() {
  return <ModelSelling slug="tata-nexon" />;
}
