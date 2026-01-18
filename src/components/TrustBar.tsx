import { ShieldCheck, Award, ThumbsUp, MapPin, Home, History } from "lucide-react";

const TRUST_ITEMS = [
    { icon: MapPin, label: "Australian Made", sub: "Locally Manufactured" },
    { icon: Home, label: "Designed for your home", sub: "Your space, Your Style, Your Fit" },
    { icon: ShieldCheck, label: "5-Year Warranty", sub: "On All Products" },
    { icon: Award, label: "Price Match", sub: "Guaranteed Value" },
    { icon: History, label: "30 Years Experience", sub: "Industry Experts" },
];

export function TrustBar() {
    return (
        <div className="bg-mcb-paper py-6 border-b border-stone-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 mobile-s:grid-cols-2 md:flex md:flex-row md:justify-between items-start md:items-center gap-y-6 gap-x-4">
                    {TRUST_ITEMS.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-2 text-mcb-charcoal/80 flex-1">
                            <item.icon size={28} className="text-mcb-terracotta mb-1" />
                            <div className="flex flex-col">
                                <span className="font-bold text-sm uppercase tracking-wide leading-tight">{item.label}</span>
                                <span className="text-xs text-stone-500">{item.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
