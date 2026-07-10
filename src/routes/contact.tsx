import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact HuluMart - Talk to Our Team" },
      {
        name: "description",
        content:
          "Questions about laptop buyback, pricing, pickup or payment? Contact the HuluMart team - we usually reply within one business day.",
      },
      { property: "og:title", content: "Contact HuluMart - Talk to Our Team" },
      {
        property: "og:description",
        content: "Reach the HuluMart team about used laptop quotes, pickup, pricing and payment.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      items: ["Contact query"],
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
        eyebrow="Contact"
        title={<>Let's <span className="text-gradient">talk laptops</span></>}
        subtitle="Whether you want a laptop quote, pickup help, or payment support, we would love to help."
      />

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: businessContact.email, href: businessContact.emailHref },
              { icon: Phone, label: "Phone", value: businessContact.phone, href: businessContact.phoneHref },
              { icon: MapPin, label: "HQ", value: businessContact.address, href: undefined },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <c.icon className="size-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="font-semibold text-foreground hover:text-primary">
                      {c.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-foreground">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Email</Label>
                <Input id="cemail" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cphone">Phone / WhatsApp</Label>
                <Input id="cphone" name="phone" inputMode="tel" placeholder="Optional" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="csubject">Subject</Label>
                <Input id="csubject" name="subject" required placeholder="How can we help?" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cmsg">Message</Label>
                <Textarea id="cmsg" name="message" required rows={5} placeholder="Tell us about your laptop or question..." />
              </div>
            </div>
            <Button type="submit" variant="hero" size="xl" className="mt-8 w-full" disabled={sending}>
              {sending ? "Sending..." : "Send message"}
              {!sending && <Send />}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
