"use client";

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
      { href: "/dashboard/ai-presence", label: "AI Presence", icon: Sparkles },
      { href: "/dashboard/content",     label: "Content",     icon: FileText },
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
                      className={[
                        "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                        isActive
                          ? "bg-[#3A3A3A] text-white relative"
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

function isItemActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
