import { MetadataRoute } from 'next'
import { LOCATIONS } from '@/lib/locations'
import { productData } from '@/lib/data'
import { LOCATION_PRODUCTS } from '@/lib/location-products'
import { getProductCanonicalPath } from '@/lib/product-canonicals'

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
        '/our-story',
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
        '/blinds/soft-vertical-drapes',
        '/blinds/roller-blinds/blockout',
        '/blinds/roller-blinds/sunscreen',
        '/blinds/venetian-blinds/slimline-aluminium',
        '/blinds/venetian-blinds/urban-wood',
        '/curtains/sheer',
        '/curtains/blockout',
        '/curtains/s-fold-curtains',
        '/curtains/double-curtains',
        '/curtains/gathered-curtains',
        '/curtains/pleated-curtains',
        '/curtains/eyelet-curtains',
        '/curtains/linen-look',
        '/curtains/motorised',
        '/curtains/theatre-velvet',
        '/curtains/translucent-curtains',
        '/shutters/plantation-shutters',
        '/shutters/plantation-shutters/timber',
        '/shutters/plantation-shutters/polymer',
        '/shutters/plantation-shutters/aluminium',
        '/shutters/roller-shutters',
        '/security/security-doors',
        '/security/fly-screens',
        '/security/pet-mesh',
        '/awnings/zipscreens',
        '/awnings/folding-arm-awnings',
        '/awnings/straight-drop-awnings',
        '/awnings/auto-awnings',
        '/awnings/fixed-guide-awnings',
        '/awnings/motorised-outdoor-blinds',
        '/awnings/wire-guide-awnings',
        '/privacy',
        '/terms',
    ]

    const coreRoutes = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'yearly' as const : 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const productRoutes = productData
        .filter((product) => getProductCanonicalPath(product.slug) === `/products/${product.slug}`)
        .map((product) => ({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))

    const locationRoutes = LOCATIONS.map((loc) => ({
        url: `${baseUrl}/locations/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const locationProductRoutes = LOCATIONS.flatMap((loc) =>
        LOCATION_PRODUCTS.map((product) => ({
            url: `${baseUrl}/locations/${loc.slug}/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.65,
        }))
    )

    return [...coreRoutes, ...productRoutes, ...locationRoutes, ...locationProductRoutes]
}
