"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface Tab {
  href: string;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  ariaLabel: string;
}

/**
 * Horizontal sub-route tabs under a page header. Active tab gets a
 * terracotta underline. Used on Leads, AI Presence, Content, Reputation.
 */
export function TabNav({ tabs, ariaLabel }: TabNavProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={ariaLabel}
      className="flex gap-1 border-b border-[var(--color-mcb-sand-deep)]"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "relative px-4 py-2.5 text-sm transition-colors",
              isActive
                ? "text-[var(--color-mcb-charcoal)] font-medium"
                : "text-[var(--color-mcb-warm-grey)] hover:text-[var(--color-mcb-charcoal)]",
            ].join(" ")}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-[var(--color-mcb-terracotta-deep)]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
