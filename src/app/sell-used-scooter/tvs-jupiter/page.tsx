import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("tvs-jupiter");

export default function Page() {
  return <ModelSelling slug="tvs-jupiter" />;
}
