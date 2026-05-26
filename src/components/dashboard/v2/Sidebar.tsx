"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Target,
  Sparkles,
  FileText,
  Star,
  Rocket,
  Compass,
  Share2,
  Activity,
  TrendingUp,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard",            label: "Home",        icon: Home },
      { href: "/dashboard/leads",      label: "Leads",       icon: Target },
      { href: "/dashboard/reputation", label: "Reputation",  icon: Star },
      { href: "/dashboard/releases",   label: "Releases",    icon: Rocket },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/dashboard/ai-presence",      label: "AI Presence",      icon: Sparkles },
      { href: "/dashboard/content",          label: "Content",          icon: FileText },
      { href: "/dashboard/growth-corridors", label: "Growth corridors", icon: TrendingUp },
    ],
  },
  {
    label: "Reference",
    items: [
      { href: "/dashboard/explorer",     label: "Explorer",     icon: Compass },
      { href: "/dashboard/social",       label: "Social links", icon: Share2 },
      { href: "/dashboard/optimization", label: "Site signals", icon: Activity },
    ],
  },
];

// ---------------------------------------------------------------------
// Shared nav list — used by both desktop sidebar and mobile drawer.
// ---------------------------------------------------------------------
function NavList({
  pathname,
  onItemClick,
}: {
  pathname: string | null;
  onItemClick?: () => void;
}) {
  return (
    <>
      {SECTIONS.map((section, sectionIndex) => (
        <div key={section.label} className={sectionIndex === 0 ? "" : "mt-6"}>
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.12em] text-[#807A6E]">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = isItemActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onItemClick}
                    className={[
                      "group relative flex min-h-[44px] items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                      isActive
                        ? "bg-[#3A3A3A] text-white"
                        : "text-[#D8D3C7] hover:bg-[#363636] hover:text-white",
                    ].join(" ")}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1 left-0 w-[3px] rounded-r bg-[var(--color-mcb-terracotta)]"
                      />
                    )}
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------
// Desktop sidebar — visible at md+ viewports only.
// ---------------------------------------------------------------------
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Dashboard navigation"
      className="hidden md:flex sticky top-0 z-30 h-screen w-60 flex-col bg-[var(--color-mcb-charcoal)] text-[var(--color-mcb-paper)]"
    >
      <div className="px-5 pt-6 pb-4">
        <p className="font-serif text-[18px] leading-none text-[var(--color-mcb-paper)]">MCB</p>
        <p className="mt-1 text-xs text-[#A39E92]">Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <NavList pathname={pathname} />
      </nav>

      <div className="border-t border-[#3A3A3A] px-5 py-4 text-xs">
        <p className="text-[#D8D3C7]">Alex Lewis</p>
        <div className="mt-2 flex items-center gap-2 text-[#807A6E]">
          <Link href="/dashboard/login" className="hover:text-white transition-colors">
            Log out
          </Link>
          <span>·</span>
          <span>v2026.5</span>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------
// Mobile nav — sticky top bar with hamburger + slide-out drawer.
// Visible below md. Drawer closes on link tap, backdrop tap, Escape.
// ---------------------------------------------------------------------
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Note: no pathname-watching effect needed — every Link inside the drawer
  // calls setOpen(false) via onItemClick / direct onClick. Browser back/forward
  // navigations leave the drawer open, which is a minor edge case worth
  // accepting in exchange for cleaner code (no cascading-render lint rule
  // workaround).

  // Body-scroll lock while drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Find the active section/item label for the bar title.
  const activeLabel = findActiveLabel(pathname);

  return (
    <>
      <header
        className="sticky top-0 z-30 flex items-center justify-between bg-[var(--color-mcb-charcoal)] px-4 py-3 text-[var(--color-mcb-paper)] md:hidden"
        aria-label="Dashboard header"
      >
        <Link href="/dashboard" className="flex items-baseline gap-2" aria-label="Dashboard home">
          <span className="font-serif text-base leading-none">MCB</span>
          <span className="text-[11px] text-[#A39E92]">{activeLabel}</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-controls="dashboard-mobile-drawer"
          aria-expanded={open}
          className="-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--color-mcb-paper)] active:bg-[#3A3A3A]"
        >
          <Menu size={22} strokeWidth={2} aria-hidden="true" />
        </button>
      </header>

      <div
        id="dashboard-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation"
        aria-hidden={!open}
        className={[
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <button
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-black/60 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <aside
          aria-label="Dashboard navigation"
          className={[
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-[var(--color-mcb-charcoal)] text-[var(--color-mcb-paper)] shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div>
              <p className="font-serif text-[18px] leading-none">MCB</p>
              <p className="mt-1 text-xs text-[#A39E92]">Dashboard</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md active:bg-[#3A3A3A]"
            >
              <X size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-2">
            <NavList pathname={pathname} onItemClick={() => setOpen(false)} />
          </nav>

          <div className="border-t border-[#3A3A3A] px-5 py-4 text-xs">
            <p className="text-[#D8D3C7]">Alex Lewis</p>
            <div className="mt-2 flex items-center gap-2 text-[#807A6E]">
              <Link
                href="/dashboard/login"
                onClick={() => setOpen(false)}
                className="hover:text-white transition-colors"
              >
                Log out
              </Link>
              <span>·</span>
              <span>v2026.5</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function isItemActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function findActiveLabel(pathname: string | null): string {
  if (!pathname) return "Dashboard";
  for (const section of SECTIONS) {
    for (const item of section.items) {
      if (isItemActive(pathname, item.href)) return item.label;
    }
  }
  return "Dashboard";
}
