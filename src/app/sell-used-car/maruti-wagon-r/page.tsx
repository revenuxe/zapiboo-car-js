import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("maruti-wagon-r");

export default function Page() {
  return <ModelSelling slug="maruti-wagon-r" />;
}
