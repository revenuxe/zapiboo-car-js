import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | HuluMart" },
      {
        name: "description",
        content:
          "The terms and conditions governing your use of HuluMart's website and doorstep scrap-collection services.",
      },
      { property: "og:title", content: "Terms & Conditions | HuluMart" },
      {
        property: "og:description",
        content: "Read the terms that govern your use of HuluMart's services.",
      },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

const updated = "12 June 2026";

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Acceptance of terms",
    body: [
      "By accessing our website or booking a pickup, you agree to these Terms & Conditions. If you do not agree, please do not use our services.",
    ],
  },
  {
    heading: "2. Our services",
    body: [
      "HuluMart provides doorstep collection of household and commercial scrap. We weigh materials on a certified digital scale at the time of pickup and pay you based on the live rate applicable at that time.",
      "Service availability depends on your locality and pincode. We may decline or reschedule a pickup where an area is not yet serviceable or where conditions prevent safe collection.",
    ],
  },
  {
    heading: "3. Pricing and payment",
    body: [
      "Rates shown on our website are indicative and may change daily based on market conditions. The final price is calculated from the certified weight recorded at pickup and the rate in effect on that day.",
      "Payment is made to you at the time of pickup through the method agreed at your door. You may review and approve the quote before any material is collected.",
    ],
  },
  {
    heading: "4. Your responsibilities",
    body: [
      "You confirm that the materials offered for collection are lawfully yours to sell and are free of hazardous, prohibited or dangerous items unless expressly agreed in advance.",
      "You agree to provide accurate booking details and to be reachable at the phone number you provide so we can confirm and complete the pickup.",
    ],
  },
  {
    heading: "5. Prohibited items",
    body: [
      "We do not accept medical, biological, radioactive, explosive or otherwise hazardous waste, or any item the collection of which is restricted by law. Our agent may refuse such items at their discretion.",
    ],
  },
  {
    heading: "6. Cancellations and no-shows",
    body: [
      "You may cancel or reschedule a booking before the agent's arrival at no charge. Repeated no-shows may affect future service availability.",
    ],
  },
  {
    heading: "7. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, HuluMart is not liable for indirect, incidental or consequential losses arising from the use of our services. Our total liability for any claim is limited to the value of the relevant pickup.",
    ],
  },
  {
    heading: "8. Changes to these terms",
    body: [
      "We may revise these Terms & Conditions at any time. Continued use of our services after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
  {
    heading: "9. Contact us",
    body: [
      "For any questions about these terms, email hulumart.com@gmail.com or use our Contact page.",
    ],
  },
];

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={<>Terms &amp; <span className="text-gradient">Conditions</span></>}
        subtitle={`The rules of the road for using HuluMart. Last updated ${updated}.`}
      />

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">{s.heading}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
