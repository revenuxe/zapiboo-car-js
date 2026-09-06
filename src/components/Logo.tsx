import Link from "next/link";
import logoAsset from "@/assets/zapiboo-final-logo-transparent.png";
const logo = logoAsset.src;
import { cn } from "@/lib/utils";

export function Logo({
  className,
  imageClassName,
  invert = false,
}: {
  className?: string;
  imageClassName?: string;
  invert?: boolean;
}) {
  return (
    <Link href="/" aria-label="Zapiboo home" className={cn("inline-flex items-center", className)}>
      <img
        src={logo}
        alt="Zapiboo — buy and sell used cars, bikes and scooters in Bangalore"
        width={1774}
        height={887}
        className={cn(
          "h-10 w-auto md:h-12",
          imageClassName,
          invert && "brightness-0 invert",
        )}
      />
    </Link>
  );
}
