import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Gavel,
  PackageCheck,
  Recycle,
  Send,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "For Business - Scrap Pickup, Delivery and Auctions | HuluMart" },
      {
        name: "description",
        content:
          "HuluMart works with small scrap shops, corporate offices and bulk sellers for scrap pickup, delivery support, auction listings and responsible recycling.",
      },
      {
        property: "og:title",
        content: "For Business - Scrap Pickup, Delivery and Auctions | HuluMart",
      },
      {
        property: "og:description",
        content:
          "Scrap pickup from shops, delivery support, auction listings and corporate scrap handling for Bangalore businesses.",
      },
    ],
    links: [{ rel: "canonical", href: "/business" }],
  }),
  component: Business,
});

const services = [
  {
    icon: Store,
    title: "Small scrap shop pickups",
    text: "We pick up sorted and mixed scrap from local scrap shops when stock is ready to move.",
  },
  {
    icon: Truck,
    title: "Scrap delivery support",
    text: "Need material moved to buyers, recyclers, or collection yards? We help arrange reliable scrap delivery.",
  },
  {
    icon: Gavel,
    title: "Auction listings",
    text: "List bulk lots for auction and reach more serious buyers for metals, paper, plastic, e-waste and surplus material.",
  },
  {
    icon: Building2,
    title: "Corporate scrap",
    text: "Offices, stores, warehouses and institutions can clear recurring or one-time scrap with documentation.",
  },
];

const process = [
  "Tell us what scrap you have, where it is, and whether you need pickup, delivery, auction support, or a corporate clearance.",
  "Our team checks volume, material type, location and buyer demand before sharing the next step.",
  "We coordinate movement, listing, weighing, settlement and proof of pickup wherever needed.",
];

function Business() {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setSending(true);
    const { error } = await supabase.from("leads").insert({
      lead_type: "query",
      scrap_mode: "query",
      items: ["Business scrap query"],
      has_photo: false,
      name,
      email,
      phone: phone || email,
      subject,
      notes: message,
      status: "new",
    });
    setSending(false);

    if (error) {
      toast.error("Couldn't send your message. Please call or WhatsApp us.");
      return;
    }

    form.reset();
    toast.success("Message sent! We'll get back to you within one business day.");
  };

  return (
    <>
      <PageHeader
        eyebrow="For business"
        title={
          <>
            Move business scrap with <span className="text-gradient">HuluMart</span>
          </>
        }
        subtitle="We pick up scraps from small scrap shops, deliver scrap to the right destination, list auction lots, handle corporate scrap and support many more bulk scrap needs."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#business-contact">
            Contact the team
            <ArrowRight />
          </a>
        </Button>
      </PageHeader>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={(i % 4) * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <service.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{service.title}</h3>
                  <p className="mt-2 text-muted-foreground">{service.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <div className="space-y-5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Recycle className="size-7" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">Bulk scrap, handled end to end</h2>
              <p className="text-muted-foreground">
                HuluMart helps business sellers move scrap faster, reach better buyers and keep the
                process organized from enquiry to settlement.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Scrap shops", "Corporate offices", "Warehouses", "Institutions"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <PackageCheck className="size-5 text-primary" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h3 className="text-xl font-bold">How it works</h3>
              <ol className="mt-6 space-y-5">
                {process.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="business-contact" className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Reveal>
            <div className="space-y-5">
              <h2 className="text-3xl font-bold sm:text-4xl">Tell us what you need moved</h2>
              <p className="text-muted-foreground">
                Share your material type, approximate quantity, pickup location and whether you want
                pickup, delivery, auction listing or corporate scrap handling.
              </p>
              <ul className="space-y-3">
                {[
                  "Quick response from the HuluMart team",
                  "Support for one-time and recurring scrap",
                  "Clear next steps before any movement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bname">Name</Label>
                  <Input id="bname" name="name" required placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bemail">Email</Label>
                  <Input
                    id="bemail"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bphone">Phone / WhatsApp</Label>
                  <Input id="bphone" name="phone" inputMode="tel" placeholder="Optional" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bsubject">Subject</Label>
                  <Input
                    id="bsubject"
                    name="subject"
                    required
                    placeholder="Pickup, delivery, auction, corporate scrap..."
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bmsg">Message</Label>
                  <Textarea
                    id="bmsg"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about the scrap, quantity, location and what support you need..."
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="mt-8 w-full"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send business enquiry"}
                {!sending && <Send />}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
