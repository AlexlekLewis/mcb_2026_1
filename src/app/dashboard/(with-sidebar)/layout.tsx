import type { ReactNode } from "react";
import { Sidebar, MobileNav } from "@/components/dashboard/v2/Sidebar";

/**
 * Dashboard v2 layout. Wraps every routable page under /dashboard EXCEPT
 * /dashboard/login (which lives outside this route group on purpose so it
 * doesn't get the sidebar shell).
 *
 * Layout structure:
 * - `MobileNav` (md:hidden) — sticky top bar + slide-out drawer for phones
 * - Below it, the flex row: desktop Sidebar (hidden md:flex) + main content
 *
 * The historical `data-surface="dashboard-v2"` attribute used to override
 * a site-wide `text-transform: capitalize` rule — that rule was removed
 * 2026-05-24 (see globals.css), so the attribute is now mostly redundant.
 * Kept for now in case any deeper dashboard styles still scope to it.
 */
export default function DashboardWithSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-surface="dashboard-v2"
      className="min-h-screen bg-[var(--color-mcb-paper)] text-[var(--color-mcb-charcoal)]"
    >
      <MobileNav />
      <div className="flex min-h-[calc(100vh-56px)] md:min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
