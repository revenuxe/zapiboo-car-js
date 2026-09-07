import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("maruti-brezza");

export default function Page() {
  return <ModelSelling slug="maruti-brezza" />;
}
