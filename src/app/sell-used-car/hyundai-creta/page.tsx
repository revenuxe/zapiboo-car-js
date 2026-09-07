import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("hyundai-creta");

export default function Page() {
  return <ModelSelling slug="hyundai-creta" />;
}
