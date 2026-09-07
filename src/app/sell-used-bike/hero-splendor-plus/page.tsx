import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("hero-splendor-plus");

export default function Page() {
  return <ModelSelling slug="hero-splendor-plus" />;
}
