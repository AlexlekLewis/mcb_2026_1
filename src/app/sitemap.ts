import { MetadataRoute } from 'next'
import { LOCATIONS } from '@/lib/locations'
import { productData } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moderncurtainsandblinds.com.au'

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
        '/blinds/roller-blinds',
        '/blinds/double-roller-blinds',
        '/blinds/roman-blinds',
        '/blinds/honeycomb-blinds',
        '/blinds/venetian-blinds',
        '/blinds/vertical-blinds',
        '/blinds/panel-glide',
        '/blinds/translucent-blinds',
        '/blinds/motorised-blinds',
        '/blinds/cassette-blinds',
        '/blinds/skylight-blinds',
        '/blinds/veri-shades',
        '/blinds/roller-blinds/blockout',
        '/blinds/roller-blinds/sunscreen',
        '/curtains/sheer',
        '/curtains/blockout',
        '/curtains/s-fold',
        '/curtains/s-fold-curtains',
        '/curtains/pleated-curtains',
        '/curtains/eyelet-curtains',
        '/curtains/linen-look',
        '/curtains/motorised',
        '/curtains/theatre-velvet',
        '/shutters/plantation-shutters',
        '/shutters/plantation-shutters/timber',
        '/shutters/plantation-shutters/polymer',
        '/shutters/plantation-shutters/aluminium',
        '/shutters/roller-shutters',
        '/security/security-doors',
        '/security/fly-screens',
        '/awnings/zipscreens',
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
