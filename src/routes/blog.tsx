import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, Tag } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { sortedBlogPosts } from "@/lib/blog";
import {
  absoluteUrl,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/seo";

const pageTitle = "Scrap & Recycling Blog | HuluMart Bangalore";
const pageDescription =
  "Guides on selling scrap in Bangalore — live scrap rates, area-wise scrap buyers, doorstep pickup tips, e-waste and recycling advice from HuluMart.";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/blog") },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: pageDescription },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/blog"),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${absoluteUrl("/blog")}#blog`,
            name: pageTitle,
            description: pageDescription,
            url: absoluteUrl("/blog"),
            blogPost: sortedBlogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
              datePublished: post.datePublished,
            })),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <PageHeader
        eyebrow="HuluMart Journal"
        title="Scrap, recycling & sustainability guides"
        description="Practical guides on selling scrap in Bangalore — live rates, area-wise scrap buyers, e-waste and doorstep pickup tips."
      />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedBlogPosts.map((post) => (
              <Reveal key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.heroImage}
                      alt={post.heroAlt}
                      width={1600}
                      height={900}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                      <Tag className="size-3" /> {post.category}
                    </span>
                    <h2 className="mt-4 text-xl font-bold leading-snug text-foreground group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" /> {formatDate(post.datePublished)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" /> {post.readingMinutes} min read
                      </span>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-gradient-navy p-8 text-center text-navy-foreground sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to turn your scrap into cash?</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-foreground/75">
              Book a free doorstep pickup with certified weighing and instant payment across Bangalore.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/pickup">
                  Book a pickup <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="lg">
                <Link to="/materials">View scrap rates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
