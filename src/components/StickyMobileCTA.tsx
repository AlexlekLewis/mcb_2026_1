"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Hide on quote page to avoid clutter
    const isQuotePage = pathname === "/quote";

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isQuotePage) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-stone-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:hidden"
                >
                    <Link
                        href="/quote"
                        className="block w-full bg-mcb-terracotta text-white text-center py-4 rounded-sm font-bold uppercase tracking-widest shadow-lg active:scale-[0.98] transition-transform"
                    >
                        Book a Free Measure and Quote
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
