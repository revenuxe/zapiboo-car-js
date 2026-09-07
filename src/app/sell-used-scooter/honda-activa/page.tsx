import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("honda-activa");

export default function Page() {
  return <ModelSelling slug="honda-activa" />;
}
