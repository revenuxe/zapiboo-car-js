import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Clock, UserRound } from "lucide-react";
import { BlogBlocks } from "@/components/blog/BlogBlocks";
import {
  getFaqItems,
  getHeadings,
  getPostBySlug,
  getRelatedPosts,
  formatPostDate,
} from "@/lib/blog";
import {
  absoluteUrl,
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  organizationSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) return {};
    const path = `/blog/${post.slug}`;
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.description },
        { name: "keywords", content: post.keywords.join(", ") },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.description },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.metaTitle },
        { name: "twitter:description", content: post.description },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            organizationSchema(path),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.cardTitle, path },
            ]),
            blogPostingSchema({
              path,
              title: post.title,
              description: post.description,
              datePublished: post.datePublished,
              dateModified: post.dateModified,
              authorName: post.author.name,
              keywords: post.keywords,
            }),
            faqSchema(getFaqItems(post)),
            ...(post.howTo ? [howToSchema({ path, ...post.howTo })] : []),
          ]),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const headings = getHeadings(post);
  const related = getRelatedPosts(post);

  return (
    <main className="bg-background">
      <article>
        <header className="bg-gradient-navy py-12 text-navy-foreground sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <nav className="text-xs text-navy-foreground/70">
              <Link to="/" className="hover:text-brand-green">
                Home
              </Link>{" "}
              /{" "}
              <Link to="/blog" className="hover:text-brand-green">
                Blog
              </Link>
            </nav>
            <span className="mt-5 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-green">
              {post.clusterLabel}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-navy-foreground/80">{post.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-foreground/70">
              <span className="flex items-center gap-1.5">
                <UserRound className="size-4" /> {post.author.name} · {post.author.role}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {post.readMinutes} min read
              </span>
              <span>Updated {formatPostDate(post.dateModified)}</span>
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {headings.length > 2 && (
            <nav className="mb-10 rounded-2xl border border-border bg-muted/40 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                What&rsquo;s inside
              </p>
              <ol className="mt-3 space-y-2 text-sm">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-primary hover:underline">
                      {i + 1}. {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <BlogBlocks blocks={post.blocks} />

          {related.length > 0 && (
            <section className="mt-14 border-t border-border pt-10">
              <h2 className="text-xl font-bold">Keep reading</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/blog/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-primary/50"
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">
                      {r.clusterLabel}
                    </span>
                    <p className="mt-2 font-semibold leading-snug">{r.cardTitle}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                    <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary">
                      Read <ArrowRight className="size-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
