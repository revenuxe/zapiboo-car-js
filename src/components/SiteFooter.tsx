import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="bg-gradient-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
              HuluMart connects scrap sellers with the world's highest-paying verified
              recyclers — with transparent live pricing and effortless doorstep pickup.
            </p>
            <div className="mt-6 space-y-2 text-sm text-navy-foreground/70">
              <p className="flex items-center gap-2"><Mail className="size-4 text-brand-green" /> hello@hulumart.com</p>
              <p className="flex items-center gap-2"><Phone className="size-4 text-brand-green" /> +1 (800) 555-0142</p>
              <p className="flex items-center gap-2"><MapPin className="size-4 text-brand-green" /> Global HQ · Singapore</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-navy-foreground/80 transition-colors hover:text-brand-green">
                    {l.label}
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
              <li><Link to="/pickup" className="text-navy-foreground/80 transition-colors hover:text-brand-green">Book a pickup</Link></li>
              <li><Link to="/business" className="text-navy-foreground/80 transition-colors hover:text-brand-green">Sell at scale</Link></li>
              <li><Link to="/materials" className="text-navy-foreground/80 transition-colors hover:text-brand-green">Today's prices</Link></li>
              <li><Link to="/contact" className="text-navy-foreground/80 transition-colors hover:text-brand-green">Talk to sales</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-navy-foreground/15 pt-8 text-sm text-navy-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} HuluMart. Powering global scrap commerce.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-brand-green">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-brand-green">Terms &amp; Conditions</Link>
            <Link to="/contact" className="transition-colors hover:text-brand-green">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
