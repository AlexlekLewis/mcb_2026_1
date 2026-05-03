import Link from 'next/link';
import { LOCATIONS, SERVICE_RADIUS_KM } from '@/lib/locations';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Service Areas Within 60km of Preston",
    description: "Free in-home measure and quote for curtains, blinds, shutters, security screens, awnings and motorisation across suburbs within 60km of Preston.",
};

export default function LocationsIndex() {
    const sortedLocations = [...LOCATIONS].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-mcb-terracotta font-bold tracking-widest uppercase text-sm mb-4 block">Service Areas</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-mcb-charcoal mb-6">Curtains and Blinds Within {SERVICE_RADIUS_KM}km of Preston</h1>
                    <p className="text-stone-500 text-lg">
                        Modern Curtains and Blinds provides free in-home measure and quote appointments for custom curtains, blinds, shutters, security screens, fly screens, awnings and motorisation across {LOCATIONS.length} Melbourne suburbs and localities.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                    {sortedLocations.map((loc) => (
                        <Link
                            key={loc.slug}
                            href={`/locations/${loc.slug}`}
                            className="text-stone-600 hover:text-mcb-terracotta transition-colors py-2 border-b border-stone-100 flex justify-between items-center group"
                        >
                            <span>{loc.name}</span>
                            <span className="text-stone-300 group-hover:text-mcb-terracotta/50">{loc.postcode}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
