import { Link } from "@tanstack/react-router";
import logo from "@/assets/hulumart-logo.webp.asset.json";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link to="/" aria-label="HuluMart home" className={cn("inline-flex items-center", className)}>
      <img
        src={logo.url}
        alt="HuluMart — Powering Global Scrap Commerce"
        width={1760}
        height={300}
        className={cn("h-9 w-auto md:h-10", invert && "brightness-0 invert")}
      />
    </Link>
  );
}
