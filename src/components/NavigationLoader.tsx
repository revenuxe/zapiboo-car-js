"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

/** Shows immediately after an internal navigation begins, before the new route streams. */
export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => { setLoading(false); }, [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return;
      const next = new URL(href, window.location.href);
      if (next.pathname !== window.location.pathname || next.search !== window.location.search) setLoading(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!loading) return null;
  return <div aria-live="polite" aria-label="Opening page" className="fixed inset-x-0 top-0 z-[100] pointer-events-none"><div className="h-1 overflow-hidden bg-primary/15"><div className="h-full w-1/2 animate-[loading-bar_0.9s_ease-in-out_infinite] rounded-full bg-primary" /></div><div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 text-xs font-semibold text-foreground shadow-elevated backdrop-blur"><LoaderCircle className="size-4 animate-spin text-primary" /> Opening Zapiboo</div></div>;
}
