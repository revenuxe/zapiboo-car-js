import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | ZAPIBOO" },
      {
        name: "description",
        content:
          "The terms and conditions governing your use of ZAPIBOO's website and used laptop buyback services.",
      },
      { property: "og:title", content: "Terms & Conditions | ZAPIBOO" },
      {
        property: "og:description",
        content: "Read the terms that govern your use of ZAPIBOO's services.",
      },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

const updated = "21 June 2026";

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Acceptance of terms",
    body: [
      "By accessing our website, requesting a quote, or booking a pickup, you agree to these Terms & Conditions. If you do not agree, please do not use our services.",
      "These terms apply to ZAPIBOO used laptop and device buyback services.",
    ],
  },
  {
    heading: "2. Our services",
    body: [
      "ZAPIBOO provides a buyback service for used laptops and electronic devices.",
      "Service availability depends on your locality and pincode. We may decline or reschedule a pickup where an area is not yet serviceable or where conditions prevent safe collection.",
    ],
  },
  {
    heading: "3. Pricing and payment",
    body: [
      "Prices shown on our website are indicative and may change based on market conditions. The final price is confirmed after physical device verification at pickup.",
      "Payment is made to you at the time of pickup through the agreed method. You may review and approve the final quote before handing over your device.",
    ],
  },
  {
    heading: "4. Used laptop and device buyback - how the quote works",
    body: [
      "The price you see online is an indicative offer generated from the condition details you select. It is not a final or guaranteed price.",
      "Your online quote is valid for 7 days from the date it is generated. Market changes or new model launches may affect pricing after this period.",
      "The final price is confirmed only after a free physical evaluation of the device at your doorstep by our trained executive.",
      "If the device's actual condition matches the answers you provided, you are paid the quoted amount. If the condition differs - for example additional damage, faults, missing accessories, battery health issues, or activation locks - a revised price is offered. You are free to accept or decline the revised price with no obligation and no charge.",
    ],
  },
  {
    heading: "5. Doorstep evaluation conditions",
    body: [
      "Our executive will inspect the device for physical condition, display quality, functionality, battery health, originality of parts and proof of ownership.",
      "Please keep the device, its original charger, and any available original bill / invoice and box ready for evaluation, as these can affect the final price.",
      "You must present a valid government-issued photo ID for KYC at the time of pickup. The name should reasonably correspond to the booking or proof of ownership.",
      "Evaluation typically takes a few minutes. The executive's assessment of physical condition and functionality, carried out transparently in your presence, forms the basis of the final price.",
    ],
  },
  {
    heading: "6. Data, accounts and device locks",
    body: [
      "Before handover you must back up and permanently remove all your personal data, and sign out of and remove all accounts and security locks - including Apple ID / Find My, Google account, Windows / Microsoft account, MDM and any anti-theft locks.",
      "ZAPIBOO is not responsible for any data left on the device. We recommend performing a factory reset before pickup.",
      "Devices that are reported lost or stolen, are blacklisted, or carry unremovable activation / ownership locks cannot be purchased.",
    ],
  },
  {
    heading: "7. Buyback payment and ownership transfer",
    body: [
      "Once you accept the final price, payment is made instantly via UPI or bank transfer to the account or number you provide. Please verify your payment details carefully - ZAPIBOO is not liable for payments sent to incorrect details provided by you.",
      "Ownership of the device transfers to ZAPIBOO only after payment is completed and you hand over the device. After successful purchase, the sale is final and the device will not be returned.",
    ],
  },
  {
    heading: "8. Your responsibilities",
    body: [
      "You confirm that the items offered for sale or collection are lawfully yours and that you are authorised to sell them.",
      "You agree to provide accurate booking details and to be reachable at the phone number you provide so we can confirm and complete the pickup.",
    ],
  },
  {
    heading: "9. Prohibited items",
    body: [
      "We do not accept medical, biological, radioactive, explosive or otherwise hazardous waste, or any item the collection of which is restricted by law. Our agent may refuse such items at their discretion.",
      "For device buyback, we do not purchase stolen, counterfeit, or locked devices, or devices where ownership cannot be reasonably established.",
    ],
  },
  {
    heading: "10. Cancellations and no-shows",
    body: [
      "You may cancel or reschedule a booking before the agent's arrival at no charge, including from your account dashboard.",
      "If you decline the final offered price after evaluation, there is no charge and your device stays with you. Repeated no-shows may affect future service availability.",
    ],
  },
  {
    heading: "11. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, ZAPIBOO is not liable for indirect, incidental or consequential losses arising from the use of our services, including any loss of data from a device. Our total liability for any claim is limited to the value of the relevant pickup or buyback transaction.",
    ],
  },
  {
    heading: "12. Changes to these terms",
    body: [
      "We may revise these Terms & Conditions at any time. Continued use of our services after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
  {
    heading: "13. Contact us",
    body: [
      "For any questions about these terms, email zapiboo.com@gmail.com or use our Contact page.",
    ],
  },
];

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={<>Terms &amp; <span className="text-gradient">Conditions</span></>}
        subtitle={`The rules of the road for using ZAPIBOO. Last updated ${updated}.`}
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
