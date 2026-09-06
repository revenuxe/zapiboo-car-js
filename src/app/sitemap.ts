import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/sell-used-car', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pickup', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/materials', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ].map(({ path, ...entry }) => ({ url: absoluteUrl(path), ...entry }));
}
