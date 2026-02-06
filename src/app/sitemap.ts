import { MetadataRoute } from 'next'
import { LOCATIONS } from '@/lib/locations'
import { productData } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moderncurtains.com.au'

    // Core pages
    const routes = [
        '',
        '/curtains',
        '/blinds',
        '/shutters',
        '/security',
        '/awnings',
        '/motorisation',
        '/contact',
        '/about',
        '/quote',
        '/projects',
        '/locations',
    ]

    const coreRoutes = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'yearly' as const : 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const productRoutes = productData.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }))

    const locationRoutes = LOCATIONS.map((loc) => ({
        url: `${baseUrl}/locations/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...coreRoutes, ...productRoutes, ...locationRoutes]
}
