import { Ruler, Hammer } from "lucide-react";
import Link from "next/link";

export function ServiceSelector() {
    return (
        <section className="w-full bg-white z-20 relative -mt-0 shadow-lg border-b border-stone-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    {/* Installation Option - Centered and Heroic */}
                    <Link href="/quote?type=installation" className="group w-full max-w-4xl py-12 px-6 flex flex-col md:flex-row items-center justify-center gap-8 hover:bg-mcb-paper transition-colors cursor-pointer rounded-xl">
                        <div className="w-20 h-20 rounded-full bg-mcb-sage/20 flex items-center justify-center text-mcb-sage-dark group-hover:bg-mcb-sage-dark group-hover:text-white transition-all duration-300 shadow-sm">
                            <Hammer size={40} />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="font-serif text-3xl text-mcb-charcoal mb-2 group-hover:text-mcb-sage-dark transition-colors">I Need Installation</h3>
                            <p className="text-stone-500 text-lg">Book a free measure & quote with a pro. We bring samples to you.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
