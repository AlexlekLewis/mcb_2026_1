"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
    {
        label: "Blinds",
        href: "/blinds",
        subcategories: [
            {
                title: "Popular",
                items: ["Roller Blinds", "Double Roller Blinds", "Roman Blinds", "Venetian Blinds"]
            },
            {
                title: "Specialty",
                items: ["Vertical Blinds", "Honeycomb Blinds", "Panel Glide"]
            },
            {
                title: "Features",
                items: ["Blockout", "Sunscreen", "Motorised"]
            }
        ]
    },
    {
        label: "Curtains",
        href: "/curtains",
        subcategories: [
            { title: "Styles", items: ["Sheer Curtains", "Blockout Curtains", "Translucent Curtains", "Velvet Curtains"] },
            { title: "Headings", items: ["S-Fold Curtains", "Pleated Curtains", "Eyelet Curtains"] }
        ]
    },
    {
        label: "Shutters",
        href: "/shutters",
        subcategories: [
            { title: "Our Range", items: ["Plantation Shutters", "Roller Shutters"] }
        ]
    },
    {
        label: "Security",
        href: "/security",
        subcategories: [
            { title: "Protection", items: ["Security Doors", "Fly Screens"] }
        ]
    },
    {
        label: "Outdoor",
        href: "/awnings", // Retaining awnings base but labeling Outdoor
        subcategories: [
            { title: "Shade & Shelter", items: ["Zipscreens", "Awnings"] }
        ]
    },
    { label: "Motorisation", href: "/motorisation" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isTransparent = isHome && !isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                    !isTransparent
                        ? "bg-white/95 backdrop-blur-md border-mcb-sand py-2 shadow-sm"
                        : "bg-transparent border-transparent py-4"
                )}
            >
                {/* Top Bar (Promo) */}
                {!isScrolled && (
                    <div className="absolute top-0 left-0 right-0 -mt-10 h-10 bg-mcb-charcoal text-white flex items-center justify-center text-xs tracking-widest uppercase font-medium">
                        New Year Sale - Up to 40% Off Motorisation
                    </div>
                )}

                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-20 lg:h-32">
                        {/* Logo */}
                        <Link href="/" className="relative z-10 block">
                            <Image
                                src="/assets/logo.png"
                                alt="Modern Curtains and Blinds"
                                width={540} // Increased res
                                height={180}
                                className="h-20 lg:h-32 w-auto object-contain scale-125 lg:scale-135 origin-center" // Matches bar height but scales up visually to hang over.
                                priority
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            {NAV_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => setActiveDropdown(item.label)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-sm font-medium tracking-wide transition-colors py-4 flex items-center gap-1",
                                            !isTransparent ? "text-mcb-charcoal hover:text-mcb-terracotta" : "text-white/90 hover:text-white"
                                        )}
                                    >
                                        {item.label}
                                        {item.subcategories && <ChevronDown size={14} className="opacity-70" />}
                                    </Link>

                                    {/* Mega Menu Dropdown */}
                                    {item.subcategories && activeDropdown === item.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-[600px] bg-white shadow-xl rounded-sm border border-stone-100 p-8 grid grid-cols-3 gap-8 cursor-default"
                                        >
                                            {item.subcategories.map((sub, idx) => (
                                                <div key={idx}>
                                                    <h4 className="font-serif text-mcb-terracotta text-lg mb-4">{sub.title}</h4>
                                                    <ul className="space-y-2">
                                                        {sub.items.map((subItem) => {
                                                            // Generate specific href for blinds and curtains
                                                            let href = item.href;
                                                            if (item.label === "Blinds") {
                                                                if (subItem === "Blockout" || subItem === "Sunscreen" || subItem === "Motorised") {
                                                                    // For now linking features roughly to roller blinds or main page
                                                                    if (subItem === "Blockout") href = "/blinds/roller-blinds/blockout"; // Example mapping
                                                                    else if (subItem === "Sunscreen") href = "/blinds/roller-blinds/sunscreen";
                                                                    else href = "/motorisation";
                                                                } else {
                                                                    href = `/blinds/${subItem.toLowerCase().replace(/ /g, "-")}`;
                                                                }
                                                            } else if (item.label === "Curtains") {
                                                                if (subItem === "Sheer Curtains") href = "/curtains/sheer";
                                                                else if (subItem === "Blockout Curtains") href = "/curtains/blockout";
                                                                else href = `/curtains/${subItem.toLowerCase().replace(/ /g, "-")}`;
                                                            } else if (item.label === "Shutters") {
                                                                href = `/shutters/${subItem.toLowerCase().replace(/ /g, "-")}`;
                                                            } else if (item.label === "Security") {
                                                                href = `/security/${subItem.toLowerCase().replace(/ /g, "-")}`;
                                                            } else if (item.label === "Outdoor") {
                                                                // Special handling if using awnings as base or separate
                                                                if (subItem === "Awnings") href = "/awnings";
                                                                else href = `/awnings/${subItem.toLowerCase().replace(/ /g, "-")}`;
                                                            }

                                                            return (
                                                                <li key={subItem}>
                                                                    <Link
                                                                        href={href}
                                                                        className="text-stone-600 hover:text-mcb-charcoal text-sm block transition-colors hover:translate-x-1"
                                                                    >
                                                                        {subItem}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            ))}
                                            {/* Visual Promo in Menu */}
                                            <div className="col-span-1 bg-mcb-paper p-4 flex flex-col items-center justify-center text-center group/promo cursor-pointer">
                                                <span className="text-xs text-mcb-sage-dark uppercase font-bold mb-2">Best Seller</span>
                                                <div className="w-full h-24 bg-stone-200 mb-2 rounded-sm overflow-hidden relative">
                                                    <Image
                                                        src="/assets/sheer_curtains.png"
                                                        alt="S-Fold Curtains"
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover/promo:scale-110"
                                                    />
                                                </div>
                                                <p className="text-sm font-serif group-hover/promo:text-mcb-terracotta transition-colors">S-Fold Curtains</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-6 xl:gap-8 ml-6 shrink-0">
                            <a href="tel:1300732319" className={cn("flex items-center gap-2 font-medium transition-colors hover:text-mcb-terracotta whitespace-nowrap shrink-0", !isTransparent ? "text-mcb-charcoal" : "text-white")}>
                                <Phone size={18} className="shrink-0" />
                                <span className="whitespace-nowrap">1300&nbsp;732&nbsp;319</span>
                            </a>
                            <button className={cn("hover:text-mcb-terracotta transition-colors", !isTransparent ? "text-mcb-charcoal" : "text-white")}>
                                <Search size={20} />
                            </button>

                            <Link href="/quote" className="bg-mcb-terracotta text-white px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl whitespace-nowrap shrink-0">
                                Book a Free Measure and Quote
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className={cn("lg:hidden p-2", !isTransparent ? "text-mcb-charcoal" : "text-white")}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 overflow-y-auto lg:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {NAV_ITEMS.map((item) => (
                                <Link key={item.label} href={item.href} className="text-2xl font-serif text-mcb-charcoal border-b border-stone-100 pb-4">
                                    {item.label}
                                </Link>
                            ))}
                            <Link href="/quote" className="bg-mcb-terracotta text-white w-full py-4 text-lg font-medium rounded-sm mt-4 text-center block">
                                Book a Free Measure and Quote
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
