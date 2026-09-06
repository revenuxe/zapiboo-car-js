"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { warmVehicleCatalogue } from "@/lib/vehicle-catalogue-cache";

type VehicleSelectionLinkProps = {
  href: string;
  image: string;
  title: string;
};

/** Gives the vehicle cards immediate feedback while the booking route opens. */
export function VehicleSelectionLink({ href, image, title }: VehicleSelectionLinkProps) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    router.prefetch(href);
    void warmVehicleCatalogue();
  }, [href, router]);

  const openBooking = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    setOpening(true);
    // Let the pressed card paint before route work starts, so every tap has feedback.
    window.requestAnimationFrame(() => router.push(href));
  };

  return (
    <Link
      href={href}
      prefetch
      onClick={openBooking}
      onPointerEnter={() => void warmVehicleCatalogue()}
      onTouchStart={() => void warmVehicleCatalogue()}
      aria-busy={opening}
      className="group relative flex h-full min-h-40 flex-col justify-end overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 text-foreground shadow-soft transition-all hover:-translate-y-1 hover:bg-primary/10 hover:shadow-elevated sm:p-5 xl:px-3"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent"
      />
      <img
        src={image}
        alt=""
        width={1536}
        height={1024}
        className="pointer-events-none absolute inset-x-4 top-3 h-22 w-[calc(100%-2rem)] object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24"
      />
      <span className="relative text-center text-sm font-bold leading-tight sm:text-base xl:whitespace-nowrap xl:text-sm">
        {title}
      </span>
      {opening && (
        <span className="absolute inset-0 z-10 grid place-items-center bg-background/80 text-sm font-bold backdrop-blur-sm">
          <span className="flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-background shadow-elevated">
            <LoaderCircle className="size-4 animate-spin" /> Opening valuation
          </span>
        </span>
      )}
    </Link>
  );
}
