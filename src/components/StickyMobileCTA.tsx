"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Hide on quote page to avoid clutter
    const isHiddenPage = pathname === "/quote" || pathname?.startsWith("/dashboard");

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isHiddenPage) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-stone-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:hidden"
                >
                    <PrimaryCTA
                        location="sticky-mobile"
                        variant="primary"
                        hideIcon
                        className="block w-full justify-center py-4 rounded-sm active:scale-[0.98] transition-transform"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
