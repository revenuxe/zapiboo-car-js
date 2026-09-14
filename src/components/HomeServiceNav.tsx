import Link from "next/link";
import { BadgeIndianRupee, Wrench } from "lucide-react";

export function HomeServiceNav({ active = "sell" }: { active?: "repair" | "sell" }) {
  const selected =
    "flex min-h-16 min-w-0 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-[#c72b2e] px-3 py-3 text-white shadow-lg hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-3 sm:px-5";
  const inactive =
    "group flex min-h-16 min-w-0 items-center justify-center gap-2.5 rounded-full px-3 py-3 text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-3 sm:px-5";
  return (
    <div className="mb-8 sm:mb-9">
      <nav
        aria-label="Vehicle services"
        className="grid w-full max-w-[432px] grid-cols-2 gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] sm:p-2"
      >
        <Link
          href="/repair"
          aria-current={active === "repair" ? "page" : undefined}
          className={active === "repair" ? selected : inactive}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-white/30 group-hover:text-white">
            <Wrench aria-hidden="true" className="size-5" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold leading-tight sm:text-lg">Repair</span>
            <span className="mt-0.5 block text-[10px] font-medium leading-[1.15] sm:mt-1 sm:text-xs sm:leading-tight">
              Fix your vehicle
            </span>
          </span>
        </Link>
        <Link
          href="/"
          aria-current={active === "sell" ? "page" : undefined}
          className={active === "sell" ? selected : inactive}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <BadgeIndianRupee aria-hidden="true" className="size-5" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold leading-tight sm:text-lg">Sell</span>
            <span className="mt-0.5 block text-[10px] font-medium leading-[1.15] sm:mt-1 sm:text-xs sm:leading-tight">
              Get a free valuation
            </span>
          </span>
        </Link>
      </nav>
    </div>
  );
}
