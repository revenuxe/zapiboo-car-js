import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { vehicleSellingLinks } from "@/lib/vehicle-selling-links";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Price guide", to: "/materials" },
      { label: "How it works", to: "/pickup" },
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Sell in Bangalore",
    links: [
      ...vehicleSellingLinks.map(({ label, path }) => ({ label, to: path })),
      { label: "Book inspection", to: "/pickup" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Talk to our team", to: "/contact" },
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-secondary/35 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card px-6 py-10 shadow-soft sm:px-10 lg:px-11 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.75fr_repeat(3,1fr)] lg:gap-8">
          <div className="max-w-md">
            <Logo imageClassName="h-12 md:h-14" />
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              Zapiboo makes selling your used car, bike or scooter simple with a fair offer, free
              doorstep inspection and secure RC transfer in Bangalore.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/zapiboo/"
                target="_blank"
                rel="noreferrer"
                aria-label="Zapiboo on Instagram"
                className="text-foreground transition-colors hover:text-primary"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.youtube.com/@Zapiboo"
                target="_blank"
                rel="noreferrer"
                aria-label="Zapiboo on YouTube"
                className="text-foreground transition-colors hover:text-primary"
              >
                <Youtube className="size-5" />
              </a>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold text-foreground">{column.title}</h2>
              <ul className="mt-6 space-y-4 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.to}
                      prefetch={false}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zapiboo. All rights reserved.</p>
          <nav
            aria-label="Legal links"
            className="flex flex-nowrap justify-between gap-2 whitespace-nowrap text-xs sm:gap-6 sm:text-sm"
          >
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
