import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ummies-essence.vercel.app';

    // Static routes
    const routes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/categories',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // In a real scenario, we would fetch product slugs from Convex here
    // and append them to the sitemap.

    return routes;
}
