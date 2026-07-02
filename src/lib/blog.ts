import blogHbrScrap from "@/assets/blog-hbr-scrap.webp";

export type BlogPost = {
  slug: string;
  title: string;
  /** Short SEO meta description (<160 chars). */
  description: string;
  /** Card excerpt shown on the blog index. */
  excerpt: string;
  heroImage: string;
  heroAlt: string;
  category: string;
  tags: string[];
  datePublished: string;
  dateModified?: string;
  readingMinutes: number;
  area?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "scrap-buyer-in-hbr-layout",
    title: "Scrap Buyer in HBR Layout, Bangalore: Rates, Pickup & Full Guide (2026)",
    description:
      "Looking for a trusted scrap buyer in HBR Layout, Bangalore? Get today's scrap rates per kg, free doorstep pickup, certified weighing and instant UPI payment with HuluMart.",
    excerpt:
      "The complete guide to selling scrap in HBR Layout — live ₹ per kg rates, how doorstep pickup works, what we buy, and why HuluMart is the most trusted scrap buyer in the area.",
    heroImage: blogHbrScrap,
    heroAlt:
      "Neatly stacked newspapers, cardboard and metal scrap ready for doorstep collection by a scrap buyer in HBR Layout, Bangalore",
    category: "Scrap Buying Guides",
    tags: [
      "Scrap Buyer HBR Layout",
      "Scrap Dealer Bangalore",
      "Doorstep Scrap Pickup",
      "Scrap Rates",
      "Raddi",
    ],
    datePublished: "2026-01-15",
    dateModified: "2026-07-02",
    readingMinutes: 9,
    area: "HBR Layout",
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export const sortedBlogPosts = [...blogPosts].sort(
  (a, b) => +new Date(b.datePublished) - +new Date(a.datePublished),
);
