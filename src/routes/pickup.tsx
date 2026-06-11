import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, PartyPopper, ShieldCheck, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { materials } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pickup")({
  head: () => ({
    meta: [
      { title: "Book a Doorstep Scrap Pickup | HuluMart" },
      {
        name: "description",
        content:
          "Schedule a free doorstep scrap pickup in 60 seconds. Pick your materials and time slot — certified weighing and instant payment included.",
      },
      { property: "og:title", content: "Book a Doorstep Scrap Pickup | HuluMart" },
      {
        property: "og:description",
        content: "Schedule your free doorstep scrap pickup. Certified weighing, instant payment.",
      },
    ],
    links: [{ rel: "canonical", href: "/pickup" }],
  }),
  component: Pickup,
});

const slots = ["Morning (8–11)", "Midday (11–2)", "Afternoon (2–5)", "Evening (5–8)"];

function Pickup() {
  const [selected, setSelected] = useState<string[]>([]);
  const [slot, setSlot] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const toggle = (slug: string) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      toast.error("Please select at least one material.");
      return;
    }
    if (!slot) {
      toast.error("Please choose a time slot.");
      return;
    }
    toast.success("Pickup requested! We'll confirm by SMS shortly.");
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <section className="bg-background py-28">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green"
          >
            <PartyPopper className="size-10" />
          </motion.div>
          <h1 className="mt-8 text-3xl font-bold sm:text-4xl">You're all booked!</h1>
          <p className="mt-4 text-muted-foreground">
            Thanks for choosing HuluMart. Our nearest agent will confirm your slot by SMS, then
            arrive with certified scales and live pricing. Sit back — your scrap is about to
            become cash.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" size="lg" onClick={() => setSubmitted(false)}>
              Book another pickup
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/materials">View live prices</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Book a pickup"
        title={<>Schedule your <span className="text-gradient">doorstep pickup</span></>}
        subtitle="It takes about a minute. No fees to book, and you only sell if you're happy with the live rate."
      />

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
            <div>
              <h2 className="text-lg font-bold">1 · What are you selling?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Select all that apply.</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {materials.map((m) => {
                  const active = selected.includes(m.slug);
                  return (
                    <button
                      type="button"
                      key={m.slug}
                      onClick={() => toggle(m.slug)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        active
                          ? "border-primary bg-gradient-brand text-primary-foreground shadow-green"
                          : "border-border bg-background text-foreground hover:border-primary/40",
                      )}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold">2 · Where & when?</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" required placeholder="+1 555 000 0000" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Pickup address</Label>
                  <Textarea id="address" required placeholder="Street, city, postal code" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred date</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>Time slot</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSlot(s)}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                          slot === s
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-background hover:border-primary/40",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold">3 · Anything else? (optional)</h2>
              <div className="mt-4 space-y-2">
                <Label htmlFor="notes">Estimated quantity or notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="e.g. roughly 50kg of copper wire and a few aluminium frames"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="mt-10 w-full">
              Request my pickup
              <ArrowRight />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No payment now. You approve the live quote before anything is sold.
            </p>
          </form>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-secondary/50 p-7">
              <h3 className="font-bold">Why book with HuluMart</h3>
              <ul className="mt-5 space-y-4 text-sm">
                {[
                  { icon: ShieldCheck, t: "Certified, tamper-proof weighing" },
                  { icon: Wallet, t: "Instant payment on the spot" },
                  { icon: Clock, t: "Same-week slots, even weekends" },
                  { icon: CheckCircle2, t: "Free to book, zero obligation" },
                ].map((row) => (
                  <li key={row.t} className="flex items-start gap-3">
                    <row.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-foreground">{row.t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-navy p-7 text-navy-foreground">
              <p className="text-sm text-navy-foreground/75">Selling in volume?</p>
              <p className="mt-1 font-bold">Get dedicated routes & contract pricing.</p>
              <Button asChild variant="outlineLight" size="sm" className="mt-4">
                <Link to="/business">
                  Explore business plans
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
