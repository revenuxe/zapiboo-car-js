import ModelSelling, { modelSellingMetadata } from "@/views/model-selling";

export const metadata = modelSellingMetadata("bajaj-pulsar");

export default function Page() {
  return <ModelSelling slug="bajaj-pulsar" />;
}
