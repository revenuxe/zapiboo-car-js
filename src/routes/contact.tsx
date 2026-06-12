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

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact HuluMart — Talk to Our Team" },
      {
        name: "description",
        content:
          "Questions about doorstep pickup, pricing or selling scrap at scale? Contact the HuluMart team — we usually reply within one business day.",
      },
      { property: "og:title", content: "Contact HuluMart — Talk to Our Team" },
      {
        property: "og:description",
        content: "Reach the HuluMart team about pickups, pricing, and business accounts.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent! We'll get back to you within one business day.");
    }, 700);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Let's <span className="text-gradient">talk scrap</span></>}
        subtitle="Whether you're a household with a garage to clear or a plant moving tonnes a week, we'd love to help."
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
                <Input id="cname" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Email</Label>
                <Input id="cemail" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="csubject">Subject</Label>
                <Input id="csubject" required placeholder="How can we help?" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cmsg">Message</Label>
                <Textarea id="cmsg" required rows={5} placeholder="Tell us a bit about your scrap or question…" />
              </div>
            </div>
            <Button type="submit" variant="hero" size="xl" className="mt-8 w-full" disabled={sending}>
              {sending ? "Sending…" : "Send message"}
              {!sending && <Send />}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
