import { MetadataRoute } from 'next'
import { LOCATIONS, isSuburbHubIndexable } from '@/lib/locations'
import { productData } from '@/lib/data'
import { getProductCanonicalPath } from '@/lib/product-canonicals'

// Stable lastModified dates per content tier. Using `new Date()` here causes
// every build to bump every URL to "just now", which signals content-farm-like
// freshness to Google across 600+ URLs. Bump these constants when the underlying
// templates change meaningfully.
const CORE_LAST_MODIFIED = new Date('2026-05-01')
const PRODUCT_LAST_MODIFIED = new Date('2026-05-01')
const LOCATION_LAST_MODIFIED = new Date('2026-01-01')
// The /guides tier is genuinely hand-written and was last revised when the
// energy-efficiency seasonal guide shipped. Bump when a guide is materially
// rewritten.
const GUIDE_LAST_MODIFIED = new Date('2026-08-13')

// Every canonical on the site is www. The apex 307-redirects, so an unset
// NEXT_PUBLIC_BASE_URL previously flipped all 89 sitemap URLs to a redirecting
// host. Fallback is now the canonical www origin (2026-07 growth audit).
const CANONICAL_ORIGIN = 'https://www.moderncurtainsandblinds.com.au'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || CANONICAL_ORIGIN

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
        '/pricing-policy',
    ]

    // Hand-written guide tier. These six pages were live, indexable and
    // self-canonical but absent from the sitemap and unlinked from anywhere in
    // the nav — effectively unpublished. Surfaced by the 2026-07 growth audit.
    const guideSlugs = [
        'energy-efficient-curtains-blinds-melbourne',
        'estate-covenant-roller-shutters-zipscreens-melbourne',
        'pooja-prayer-room-blackout-curtains-australia',
        'new-build-window-furnishings-not-included',
        'window-furnishings-northern-growth-corridor',
        'window-furnishings-western-growth-corridor',
        'window-furnishings-south-east-growth-corridor',
    ]

    const coreRoutes = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: CORE_LAST_MODIFIED,
        changeFrequency: route === '' ? 'yearly' as const : 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const productRoutes = productData
        .filter((product) => getProductCanonicalPath(product.slug) === `/products/${product.slug}`)
        .map((product) => ({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: PRODUCT_LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))

    // Only indexable suburb hubs (woven + priority core suburbs). The thin
    // long-tail hubs and ALL suburb×product pages are noindexed and therefore
    // omitted from the sitemap. 2026-06-14 growth audit — see @/lib/locations.
    const locationRoutes = LOCATIONS
        .filter((loc) => isSuburbHubIndexable(loc.slug))
        .map((loc) => ({
            url: `${baseUrl}/locations/${loc.slug}`,
            lastModified: LOCATION_LAST_MODIFIED,
            changeFrequency: 'yearly' as const,
            priority: 0.7,
        }))

    const guideRoutes = [
        {
            url: `${baseUrl}/guides`,
            lastModified: GUIDE_LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        ...guideSlugs.map((slug) => ({
            url: `${baseUrl}/guides/${slug}`,
            lastModified: GUIDE_LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ]

    return [...coreRoutes, ...productRoutes, ...locationRoutes, ...guideRoutes]
}
