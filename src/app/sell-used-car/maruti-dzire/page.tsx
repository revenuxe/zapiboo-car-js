import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("maruti-dzire");

export default function Page() {
  return <ModelSelling slug="maruti-dzire" />;
}
