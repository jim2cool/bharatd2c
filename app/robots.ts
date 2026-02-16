import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/super-admin/', '/api/'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easyd2c.in'}/sitemap.xml`,
    }
}
