"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/lib/cro-data";
import { quoteHref, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 bg-mcb-charcoal px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white">
        Free in-home measure and quote across Melbourne
      </div>
      <nav
        className={cn(
          "fixed left-0 right-0 top-8 z-50 border-b transition-all duration-300",
          isTransparent ? "border-transparent bg-transparent py-2" : "border-mcb-sand bg-white/95 py-1 shadow-sm backdrop-blur-md"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-[72px] items-center justify-between gap-3 md:h-[76px] lg:h-20">
            <Link href="/" className="relative z-10 block shrink-0" aria-label="Modern Curtains and Blinds home">
              <Image
                src="/assets/logo-nav.png"
                alt="Modern Curtains and Blinds"
                width={1188}
                height={340}
                className="h-auto w-[172px] object-contain md:w-[190px] lg:w-[220px] xl:w-[250px]"
                priority
              />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:flex lg:gap-4">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative flex h-full items-center"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 py-4 text-xs font-semibold transition-colors lg:text-sm",
                      isTransparent ? "text-white/90 hover:text-white" : "text-mcb-charcoal hover:text-mcb-terracotta"
                    )}
                  >
                    {item.label}
                    {"groups" in item && item.groups ? <ChevronDown size={14} className="opacity-70" /> : null}
                  </Link>

                  {"groups" in item && item.groups && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full grid w-[720px] grid-cols-3 gap-8 rounded-sm border border-stone-100 bg-white p-8 shadow-xl"
                    >
                      {item.groups.map((group) => (
                        <div key={group.title}>
                          <h4 className="mb-4 font-serif text-lg text-mcb-terracotta">{group.title}</h4>
                          <ul className="space-y-2">
                            {group.items.map((subItem) => (
                              <li key={subItem.href + subItem.label}>
                                <Link
                                  href={subItem.href}
                                  className="block text-sm text-stone-600 transition-colors hover:translate-x-1 hover:text-mcb-charcoal"
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="rounded-sm bg-mcb-paper p-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-mcb-sage-dark">Need help choosing?</p>
                        <p className="mb-4 text-sm leading-relaxed text-stone-600">
                          Book a free visit and we will bring samples, measure and recommend the right options.
                        </p>
                        <Link href={quoteHref("Unsure / Need Advice")} className="text-sm font-bold uppercase tracking-wider text-mcb-terracotta">
                          Ask an expert
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden shrink-0 items-center gap-3 xl:flex">
              <a
                href={SITE.phoneHref}
                className={cn(
                  "hidden items-center gap-2 whitespace-nowrap font-semibold transition-colors hover:text-mcb-terracotta xl:flex",
                  isTransparent ? "text-white" : "text-mcb-charcoal"
                )}
              >
                <Phone size={18} />
                {SITE.phoneDisplay}
              </a>
              <Link href={quoteHref()} className="whitespace-nowrap rounded-sm bg-mcb-terracotta px-3 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-stone-800 xl:px-4">
                Book Free Measure & Quote
              </Link>
            </div>

            <button
              className={cn("relative z-10 p-2 md:hidden", isTransparent ? "text-white" : "text-mcb-charcoal")}
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 pb-10 pt-32 md:hidden"
          >
            <div className="space-y-7">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-stone-100 pb-5">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-2xl text-mcb-charcoal"
                  >
                    {item.label}
                  </Link>
                  {"groups" in item && item.groups ? (
                    <div className="mt-4 grid gap-3">
                      {item.groups.flatMap((group) => group.items).map((subItem) => (
                        <Link
                          key={subItem.href + subItem.label}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm font-medium text-stone-600"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 rounded-sm border border-stone-200 py-4 font-bold text-mcb-charcoal">
                <Phone size={18} /> {SITE.phoneDisplay}
              </a>
              <Link
                href={quoteHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-sm bg-mcb-terracotta py-4 text-center text-lg font-bold text-white"
              >
                Book Free Measure & Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
