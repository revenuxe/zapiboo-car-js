import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts, formatPostDate } from "@/lib/blog";
import {
  absoluteUrl,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/seo";

const title = "Laptop Resale Blog - Prices, Data Safety & Selling Guides | HuluMart";
const description =
  "Practical guides on selling used laptops in Bangalore: real resale price bands, how buyers calculate value, safe data wiping and the best time to sell.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/blog") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/blog"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${absoluteUrl("/blog")}#blog`,
            name: "HuluMart Laptop Resale Blog",
            url: absoluteUrl("/blog"),
            blogPost: blogPosts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.datePublished,
              dateModified: p.dateModified,
            })),
          },
        ]),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = blogPosts;

  return (
    <main className="bg-background">
      <section className="bg-gradient-navy py-14 text-navy-foreground sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            HuluMart Journal
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Selling a used laptop in Bangalore, explained properly
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-navy-foreground/80">
            Field notes from thousands of doorstep pickups — real price bands, the checks that
            change your quote, and how to hand over a device safely.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="block rounded-3xl border border-border bg-card p-7 shadow-soft transition-colors hover:border-primary/50 sm:p-10"
        >
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            {featured.clusterLabel}
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">{featured.title}</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">{featured.excerpt}</p>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>{formatPostDate(featured.datePublished)}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> {featured.readMinutes} min read
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              Read the guide <ArrowRight className="size-4" />
            </span>
          </p>
        </Link>

        <h2 className="mt-14 text-xl font-bold sm:text-2xl">More from the cluster</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/50"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                {post.clusterLabel}
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug">{post.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
              <p className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatPostDate(post.datePublished)}</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> {post.readMinutes} min
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
