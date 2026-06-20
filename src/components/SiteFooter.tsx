import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/site-data";
import { businessContact, serviceAreas } from "@/lib/seo";

export function SiteFooter() {
  const footerAreas = serviceAreas.slice(0, 8);

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
              Ready to clear out the clutter?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              Book a HuluMart pickup in under a minute. We will handle the weighing, collection, and
              payment at your doorstep.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="secondary">
                <Link to="/pickup">
                  Sell Your Scrap Now
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outlineLight">
                <Link to="/materials">View Prices</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/80">
              {["No hidden charges", "Same-day pickup", "Instant payment"].map((item) => (
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
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.7fr_1fr_1fr]">
            <div>
              <Logo invert />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
                HuluMart helps Bangalore homes, apartments and businesses sell scrap with
                transparent rates, certified weighing and reliable doorstep pickup.
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
                <li>
                  <Link
                    to="/top-scrap-buyers"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Top Scrap Buyers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/scrap-cars"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Scrap Cars
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
                Service areas
              </h4>
              <ul className="mt-5 space-y-3 text-sm">
                {footerAreas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      to="/areas/$area"
                      params={{ area: area.slug }}
                      className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                    >
                      Scrap buyers in {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
                Get started
              </h4>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <Link
                    to="/pickup"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Book a pickup
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Sell at scale
                  </Link>
                </li>
                <li>
                  <Link
                    to="/materials"
                    className="text-navy-foreground/80 transition-colors hover:text-brand-green"
                  >
                    Today's prices
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
            <p>© {new Date().getFullYear()} HuluMart. Doorstep scrap collection in Bangalore.</p>
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
