import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCATIONS, getLocationBySlug, getNearbyLocations, hasDedicatedSuburbPage, isSuburbHubIndexable } from '@/lib/locations';
import { ProductTemplate } from '@/components/ProductTemplate';
import { LOCATION_PRODUCTS } from '@/lib/location-products';
import { PageViewTracker } from '@/components/PageViewTracker';
import { LocalBusinessSchema, FaqPageSchema } from '@/components/RichSchema';
import { getSuburbContent } from '@/lib/region-content';

interface Props {
    params: Promise<{
        suburb: string;
    }>;
}

// Suburbs with their own dedicated static-segment page (woven corridor pages
// and established-suburb pages) override this dynamic route. Filter them out of
// generateStaticParams so we don't double-generate at build (Next.js errors
// when a static + dynamic route both claim the same path). The canonical check
// lives in @/lib/locations (hasDedicatedSuburbPage).
export async function generateStaticParams() {
    return LOCATIONS
        .filter((loc) => !hasDedicatedSuburbPage(loc.slug))
        .map((loc) => ({ suburb: loc.slug }));
}

// Generate unique metadata for each location
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { suburb: slug } = await params;
    const suburb = getLocationBySlug(slug);
    if (!suburb) return {};

    return {
        title: `Curtains, Blinds & Shutters ${suburb.name} | Free Quote`,
        description: `Curtains and blinds in ${suburb.name} ${suburb.postcode}. Custom curtains, roller blinds, shutters, security doors, fly screens and awnings with free in-home measure and quote.`,
        // Thin long-tail suburb hubs are noindexed (follow kept so link equity
        // still flows to money pages). Only priority/woven suburbs stay indexable.
        robots: isSuburbHubIndexable(slug) ? undefined : { index: false, follow: true },
        alternates: {
            canonical: `/locations/${suburb.slug}`,
        },
        openGraph: {
            title: `Curtains and Blinds ${suburb.name}`,
            description: `Free in-home measure and quote for custom curtains, blinds, shutters and security screens in ${suburb.name}.`,
        }
    };
}

export default async function LocationPage({ params }: Props) {
    const { suburb: slug } = await params;
    const suburb = getLocationBySlug(slug);
    const nearby = getNearbyLocations(slug);

    if (!suburb) {
        notFound();
    }

    // Region-keyed content so each suburb reads differently to Google and humans.
    const regionContent = getSuburbContent(suburb);

    // Features rotate the angle by region to break the boilerplate-across-693-pages pattern.
    const features = [
        {
            title: `Local to ${suburb.name}`,
            description: regionContent.installationContext,
        },
        {
            title: "Samples Brought to You",
            description: "Compare fabrics, colours, textures and mesh options in your own home before choosing."
        },
        {
            title: `Popular in this part of Melbourne`,
            description: regionContent.productEmphasis,
        }
    ];

    const types = [
        {
            title: "Custom Blinds",
            description: `Modern roller, sunscreen, translucent, honeycomb, Venetian and specialty blinds for ${suburb.name} homes.`,
            href: `/locations/${suburb.slug}/blinds`,
            image: "/assets/roller_blind_hero.webp"
        },
        {
            title: "Custom Curtains",
            description: "Sheer, blockout, double, Wavefold and motorised curtains measured and installed.",
            href: `/locations/${suburb.slug}/curtains`,
            image: "/assets/curtain_hero.png"
        },
        {
            title: "Plantation Shutters",
            description: "Timeless plantation shutters that increase curbside appeal and offer superior light control.",
            href: `/locations/${suburb.slug}/shutters`,
            image: "/images/plantation-shutters-hero.webp"
        },
        {
            title: "Security Doors & Screens",
            description: "Security doors, fly screens and pet mesh custom fitted for peace of mind.",
            href: `/locations/${suburb.slug}/security-doors`,
            image: "/images/security-door-hero.webp"
        }
    ];

    const faqItems = [
        { question: `Do you service ${suburb.name}?`, answer: `Yes. We offer in-home measure and quote appointments across ${suburb.name} ${suburb.postcode} and nearby Melbourne suburbs. Call 1300 732 319 or request a quote online.` },
        { question: `How much does a quote cost in ${suburb.name}?`, answer: `Quotes are free. Modern Curtains and Blinds visits ${suburb.name} customers in-home, brings samples, measures every opening and provides a detailed written quote with no obligation.` },
        { question: "Can you quote multiple products in one visit?", answer: "Yes. We can measure and quote curtains, blinds, shutters, security screens, fly screens, awnings and motorisation during one appointment." },
        { question: "Do you bring samples?", answer: "Yes. We bring suitable fabric, colour and texture samples so you can compare them in your own home light before deciding." },
        { question: `How long does delivery take in ${suburb.name}?`, answer: `Most standard curtain and blind orders are produced and installed within a few weeks of order confirmation. Specific lead time is provided in the written quote.` },
    ];

    return (
        <>
            <PageViewTracker
                event="view_location"
                payload={{
                    page_type: "location",
                    suburb_slug: suburb.slug,
                    suburb_name: suburb.name,
                    suburb_postcode: suburb.postcode,
                }}
            />
            <LocalBusinessSchema suburb={suburb} />
            <FaqPageSchema items={faqItems} />
            <ProductTemplate
                title={`Curtains, Blinds & Shutters in ${suburb.name}`}
                subtitle={`Free in-home measure and quote in ${suburb.name}`}
                heroImage="/assets/curtain_hero.png"
                description={`${regionContent.regionalAngle} ${regionContent.localTrustSignal}`}
                features={features}
                intentLabel={`${suburb.name} service area`}
                decisionGuide={[
                    { title: "For bedrooms", description: "Blockout curtains, blockout roller blinds and roller shutters for privacy and better sleep." },
                    { title: "For living areas", description: "Sheers, Wavefold curtains, sunscreen blinds and translucent blinds for soft light and daytime privacy." },
                    { title: "For security", description: "Security doors, fly screens and pet mesh can be quoted during the same visit." },
                ]}
                types={types}
                ctaText="Book Free Measure"
                nearbyLocations={nearby}
                faq={faqItems}
                internalLinks={{
                    title: `Popular products in ${suburb.name}`,
                    description: `Each product page is tailored for ${suburb.name} so customers can move from local intent to the right quote path quickly.`,
                    // Cap at 12 featured products per suburb. Linking all 47 from every suburb
                    // creates ~32k thin internal links and signals content-farm behaviour to Google.
                    links: LOCATION_PRODUCTS.slice(0, 12).map((product) => ({
                        label: `${product.title} ${suburb.name}`,
                        href: `/locations/${suburb.slug}/${product.slug}`,
                        description: product.bestFor,
                    })),
                }}
            />
        </>
    );
}
