import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/site-data";
import { businessContact } from "@/lib/seo";

export function SiteFooter() {
  return (
    <>
      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl bg-emerald-900 px-6 py-12 text-center text-white shadow-elevated sm:px-10 md:py-16"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          >
            <Sparkles className="mx-auto size-9 text-brand-green" />
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold sm:text-4xl">
              Ready to sell your used laptop?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              Get an instant HuluMart quote in minutes. We will verify the device at your doorstep
              and pay you the same day.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="hero">
                <Link to="/">
                  Sell Laptop Now
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/80">
              {["Free pickup", "Data-wipe support", "Instant payment"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand-green" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <Logo invert />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
                HuluMart helps Bangalore customers sell used laptops with transparent pricing,
                free doorstep pickup and instant payment.
              </p>
              <div className="mt-6 space-y-2 text-sm text-navy-foreground/70">
                <p className="flex items-center gap-2">
                  <Mail className="size-4 text-brand-green" /> {businessContact.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-brand-green" /> {businessContact.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand-green" /> {businessContact.address}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
                Explore
              </h4>
              <ul className="mt-5 space-y-3 text-sm">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
                Laptop
              </h4>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Sell laptop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Talk to us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-navy-foreground/15 pt-8 text-sm text-navy-foreground/60 sm:flex-row">
            <p>© {new Date().getFullYear()} HuluMart. Used laptop buyback in Bangalore.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link to="/privacy" className="transition-colors hover:text-brand-green">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-brand-green">
                Terms &amp; Conditions
              </Link>
              <Link to="/contact" className="transition-colors hover:text-brand-green">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
