import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("maruti-baleno");

export default function Page() {
  return <ModelSelling slug="maruti-baleno" />;
}
