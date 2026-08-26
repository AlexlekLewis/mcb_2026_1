import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    // Fallback is the canonical www origin. The apex 307-redirects, so an unset
    // NEXT_PUBLIC_BASE_URL previously advertised a redirecting sitemap host.
    // Mirrors the same hardening applied to sitemap.ts in the 2026-07 audit.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.moderncurtainsandblinds.com.au'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
