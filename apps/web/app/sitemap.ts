import { MetadataRoute } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@workspaceRoot/convex/_generated/api';

const BASE_URL = 'https://ummieessence.store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/shop', priority: 0.9, changeFrequency: 'daily' as const },
        { path: '/categories', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    ].map(({ path, priority, changeFrequency }) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    // Dynamically include all product pages
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const products = await fetchQuery(api.products.getAllSlugs, {});
        productRoutes = (products ?? [])
            .filter((p: { slug?: string }) => p.slug)
            .map((p: { slug: string; updatedAt?: number }) => ({
                url: `${BASE_URL}/product/${p.slug}`,
                lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
    } catch {
        // Fail gracefully — static routes still served
    }

    return [...staticRoutes, ...productRoutes];
}
