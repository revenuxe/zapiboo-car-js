import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ZAPIBOO" },
      {
        name: "description",
        content:
          "How ZAPIBOO collects, uses, stores and protects your personal information when you request a used laptop quote or use our services.",
      },
      { property: "og:title", content: "Privacy Policy | ZAPIBOO" },
      {
        property: "og:description",
        content: "Learn how ZAPIBOO handles and protects your personal data.",
      },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

const updated = "12 June 2026";

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Who we are",
    body: [
      "ZAPIBOO (\"ZAPIBOO\", \"we\", \"us\" or \"our\") operates a used laptop buyback service and online platform. This Privacy Policy explains how we handle personal information when you visit our website, request a quote, or otherwise interact with us.",
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Quote and pickup details: your name, phone number, service address, locality, pincode, preferred pickup date and time slot, device details, condition answers, and optional photos you choose to share.",
      "Account information: if you create an account, your email address and any profile details you provide (such as full name and phone number).",
      "Usage data: technical information such as your device, browser type, and pages visited, collected automatically to keep the service secure and reliable.",
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      "To generate quotes, schedule pickup, complete laptop verification and contact you (including via WhatsApp or phone) about your request.",
      "To process payments due to you for purchased devices and to keep records required for accounting and compliance.",
      "To improve our services, prevent fraud and abuse, and comply with legal obligations.",
    ],
  },
  {
    heading: "4. Sharing your information",
    body: [
      "We share request details only with the field agents and logistics partners who fulfil your pickup. We do not sell your personal information.",
      "We may disclose information where required by law, regulation, legal process, or to protect the rights, property or safety of ZAPIBOO, our users or others.",
    ],
  },
  {
    heading: "5. Data retention",
    body: [
      "We keep your information only as long as needed to provide the service, meet legal and tax requirements, and resolve disputes. When no longer required, we delete or anonymise it.",
    ],
  },
  {
    heading: "6. Security",
    body: [
      "We use industry-standard technical and organisational measures, including access controls and encryption in transit, to protect your data. No method of transmission or storage is completely secure, but we work continuously to safeguard your information.",
    ],
  },
  {
    heading: "7. Your rights",
    body: [
      "You may request access to, correction of, or deletion of your personal information, and you may withdraw consent for non-essential processing. To exercise these rights, contact us using the details below.",
    ],
  },
  {
    heading: "8. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. Material changes will be posted on this page with a revised \"last updated\" date.",
    ],
  },
  {
    heading: "9. Contact us",
    body: [
      "Questions about this policy or your data? Email us at zapiboo.com@gmail.com or reach out through our Contact page.",
    ],
  },
];

function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={<>Privacy <span className="text-gradient">Policy</span></>}
        subtitle={`Your trust matters. This policy explains what we collect and how we use it. Last updated ${updated}.`}
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
