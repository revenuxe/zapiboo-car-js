import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRepairPrice, type RepairService } from "@/lib/repair-services";
import { ServiceIcon } from "./ServiceIcon";

export function ServiceCard({ service }: { service: RepairService }) {
  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col rounded-2xl border p-4 transition-colors hover:border-primary/50 focus-within:border-primary sm:p-7",
        service.badge
          ? "border-primary/45 bg-primary/[0.025] shadow-soft"
          : "border-border bg-card",
      )}
    >
      <div className="mb-3 flex min-h-9 items-center justify-between gap-3 sm:mb-5 sm:min-h-10">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:size-10">
          <ServiceIcon name={service.icon} />
        </span>
        {service.badge && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary sm:px-3 sm:py-1.5 sm:text-[10px]">
            {service.badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold leading-snug tracking-tight sm:min-h-[50px] sm:text-lg">
        {service.serviceName}
      </h3>
      <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:mt-2 sm:min-h-[72px] sm:text-sm sm:leading-6">
        {service.description}
      </p>
      <div className="mt-4 sm:mt-5">
        <p className="text-xs font-medium text-muted-foreground">Starting at</p>
        <p className="mt-0.5 text-2xl font-extrabold tracking-tight tabular-nums sm:mt-1 sm:text-3xl">
          {formatRepairPrice(service.startingPrice)}
        </p>
      </div>
      <ul className="mb-4 mt-3 space-y-1.5 sm:mb-6 sm:mt-5 sm:space-y-2">
        {service.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5"
          >
            <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary sm:size-4" />
            {highlight}
          </li>
        ))}
      </ul>
      <Link
        href={service.landingPageUrl}
        aria-label={`${service.cta}: ${service.serviceName}`}
        className={cn(
          "mt-auto inline-flex min-h-10 items-center justify-between gap-3 rounded-lg border px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:brightness-95 sm:min-h-12 sm:px-4 sm:text-sm",
          service.badge
            ? "border-primary bg-primary text-primary-foreground hover:brightness-110"
            : "border-border bg-background hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
        )}
      >
        {service.cta}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}
