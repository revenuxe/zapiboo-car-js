import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("royal-enfield-classic-350");

export default function Page() {
  return <ModelSelling slug="royal-enfield-classic-350" />;
}
