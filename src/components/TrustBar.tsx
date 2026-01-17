import { ShieldCheck, Award, ThumbsUp, MapPin } from "lucide-react";

const TRUST_ITEMS = [
    { icon: MapPin, label: "Australian Made", sub: "Locally Manufactured" },
    { icon: ShieldCheck, label: "5-Year Warranty", sub: "On All Products" },
    { icon: Award, label: "Price Match", sub: "Guaranteed Value" },
];

export function TrustBar() {
    return (
        <div className="bg-mcb-paper py-6 border-b border-stone-200">
            <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
                {TRUST_ITEMS.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-mcb-charcoal/80">
                        <item.icon size={24} className="text-mcb-terracotta" />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                            <span className="text-xs text-stone-500 hidden sm:block">{item.sub}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
