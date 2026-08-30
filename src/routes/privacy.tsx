import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return <main className="bg-background"><PageHeader title="Privacy policy" subtitle="How ZAPIBOO handles your information when you buy or sell a used vehicle." /><section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-muted-foreground sm:px-6"><p>We collect the contact, vehicle, address and booking details needed to provide a valuation, arrange an inspection, complete a sale, and provide customer support.</p><p>Optional vehicle photos and location details are used only to prepare for your inspection. We do not sell personal information.</p><p>We retain records where required for payment, ownership-transfer, safety and legal compliance. You may contact us to request access, correction or deletion of your personal information, subject to those obligations.</p></section></main>;
}
