import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/account/', '/api/', '/seed/'],
        },
        sitemap: 'https://ummies-essence.vercel.app/sitemap.xml',
    };
}
