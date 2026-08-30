import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { serviceAreas, siteUrl } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";
import { getLaptopBrandBySlug, laptopBrands, modelSlug } from "@/lib/laptop-brands";

const BASE_URL = siteUrl;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

function toDateOnly(value?: string | null) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/sell/laptops", changefreq: "weekly", priority: "0.8" },
          { path: "/pickup", changefreq: "weekly", priority: "0.9" },
          { path: "/materials", changefreq: "weekly", priority: "0.8" },
          { path: "/how-it-works", changefreq: "monthly", priority: "0.7" },
          { path: "/listings", changefreq: "daily", priority: "0.7" },
          { path: "/areas", changefreq: "monthly", priority: "0.7" },
          { path: "/business", changefreq: "monthly", priority: "0.6" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },
          ...serviceAreas.map((area) => ({
            path: `/areas/${area.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          ...blogPosts.map((post) => ({
            path: `/blog/${post.slug}`,
            changefreq: "monthly" as const,
            priority: post.cluster === "pillar" ? "0.9" : "0.7",
            lastmod: post.dateModified,
          })),
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          ...serviceAreas.map((area) => ({
            path: `/sell-used-laptop/${area.slug}`,
            changefreq: "weekly" as const,
            priority: "0.75",
          })),
          ...laptopBrands.map((brand) => ({
            path: `/sell-old-laptop/${brand.slug}`,
            changefreq: "monthly" as const,
            priority: "0.85",
          })),
          ...laptopBrands.flatMap((brand) =>
            brand.models.map((m) => ({
              path: `/sell-old-laptop/${brand.slug}/${modelSlug(m)}`,
              changefreq: "monthly" as const,
              priority: "0.7",
            })),
          ),
        ];

        // Device catalog (category > brand > series) is DB-driven — the deepest
        // level ($model) is the noindex booking/checkout step and is deliberately
        // excluded here.
        try {
          const { data: categories } = await supabaseAdmin
            .from("device_categories")
            .select("id, slug")
            .eq("active", true);

          for (const category of categories ?? []) {
            const { data: brands } = await supabaseAdmin
              .from("device_brands")
              .select("id, slug, updated_at")
              .eq("category_id", category.id)
              .eq("active", true);

            for (const brand of brands ?? []) {
              // Skip brands that have a static /sell-old-laptop/{brand} content page —
              // that page is canonical for this keyword (see sell.$category_.$brand.tsx),
              // so listing both here would contradict the canonical tag.
              const hasStaticEquivalent =
                category.slug === "laptops" && !!getLaptopBrandBySlug(brand.slug);
              if (!hasStaticEquivalent) {
                entries.push({
                  path: `/sell/${category.slug}/${brand.slug}`,
                  changefreq: "weekly",
                  priority: "0.75",
                  lastmod: toDateOnly(brand.updated_at),
                });
              }

              const { data: seriesRows } = await supabaseAdmin
                .from("device_series")
                .select("slug, updated_at")
                .eq("brand_id", brand.id)
                .eq("active", true);

              for (const series of seriesRows ?? []) {
                entries.push({
                  path: `/sell/${category.slug}/${brand.slug}/${series.slug}`,
                  changefreq: "weekly",
                  priority: "0.7",
                  lastmod: toDateOnly(series.updated_at),
                });
              }
            }
          }
        } catch (err) {
          // Sitemap should still serve the static entries even if the DB is briefly unreachable.
          console.error("[sitemap] device catalog lookup failed", err);
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
