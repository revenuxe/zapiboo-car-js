import { useState } from "react";
import { Tag } from "lucide-react";

interface BrandLogoProps {
  src?: string | null;
  name: string;
  eager?: boolean;
  highPriority?: boolean;
}

/**
 * Brand logo with a blurred low-quality placeholder (LQIP) that swaps to the
 * full image on load. The placeholder is the same URL rendered tiny + blurred
 * so it paints instantly from the same HTTP cache entry, giving the grid a
 * filled-in look immediately and improving perceived LCP.
 */
export function BrandLogo({ src, name, eager, highPriority }: BrandLogoProps) {
  const [loaded, setLoaded] = useState(false);

  if (!src) return <Tag className="size-8 text-primary" />;

  return (
    <div className="relative flex size-16 items-center justify-center overflow-hidden">
      {/* Blurred placeholder — a tiny scaled-up copy while the real image decodes. */}
      <img
        src={src}
        aria-hidden
        alt=""
        width={16}
        height={16}
        className={`absolute inset-0 m-auto size-16 scale-110 object-contain blur-md transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src={src}
        alt={`${name} logo`}
        width={64}
        height={64}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={highPriority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`relative max-h-full max-w-full object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
