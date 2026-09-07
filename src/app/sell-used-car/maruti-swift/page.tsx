import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("maruti-swift");

export default function Page() {
  return <ModelSelling slug="maruti-swift" />;
}
