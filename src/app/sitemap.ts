import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { vehicleSellingLinks } from '@/lib/vehicle-selling-links';
import { sellingModels, modelPath } from '@/lib/selling-models';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    ...vehicleSellingLinks.map(({ path }) => ({ path, priority: 0.9, changeFrequency: 'monthly' as const })),
    ...sellingModels.map((model) => ({ path: modelPath(model), priority: 0.8, changeFrequency: 'monthly' as const })),
    { path: '/pickup', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/materials', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ].map(({ path, ...entry }) => ({ url: absoluteUrl(path), ...entry }));
}
