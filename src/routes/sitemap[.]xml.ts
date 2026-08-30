import { createFileRoute } from "@tanstack/react-router";
import { siteUrl } from "@/lib/seo";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/pickup", changefreq: "weekly", priority: "0.9" },
          { path: "/materials", changefreq: "weekly", priority: "0.8" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
        ];
        const urls = entries.map((entry) => [
          "  <url>",
          `    <loc>${siteUrl}${entry.path}</loc>`,
          entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
          entry.priority ? `    <priority>${entry.priority}</priority>` : null,
          "  </url>",
        ].filter(Boolean).join("\n"));
        return new Response(
          [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, "</urlset>"].join("\n"),
          { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } },
        );
      },
    },
  },
});
