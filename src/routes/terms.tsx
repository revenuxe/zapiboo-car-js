import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return <main className="bg-background"><PageHeader title="Terms of service" subtitle="The terms for ZAPIBOO's used-vehicle buying and selling services." /><section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-muted-foreground sm:px-6"><p>Vehicle valuations are indicative until a trained evaluator inspects the vehicle, its documents and its condition. You may decline the final offer without charge.</p><p>To sell a vehicle, you must be authorised to do so and provide accurate ownership, registration and condition information. We do not purchase vehicles with unresolved ownership, legal or financing issues.</p><p>Payment is made after you accept the final offer. RC transfer and related paperwork are handled according to the applicable process and timelines.</p></section></main>;
}
