import { businessContact } from "@/lib/seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const whatsappMessage =
  "Hi HuluMart, I want to sell my used laptop in Bangalore. Please help me get a quote.";

export function FloatingWhatsApp() {
  const href = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with HuluMart on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#00E676] shadow-elevated ring-4 ring-background transition-transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/30 sm:bottom-6 sm:right-6 sm:size-16"
    >
      <WhatsAppIcon className="size-9 sm:size-11" />
    </a>
  );
}
