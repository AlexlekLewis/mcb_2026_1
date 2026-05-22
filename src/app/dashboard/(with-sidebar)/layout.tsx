import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/v2/Sidebar";

/**
 * Dashboard v2 layout. Wraps every routable page under /dashboard EXCEPT
 * /dashboard/login (which lives outside this route group on purpose so it
 * doesn't get the sidebar shell).
 *
 * `data-surface="dashboard-v2"` triggers the globals.css override that
 * disables the global `text-transform: capitalize` rule — so labels like
 * "AI" and "GBP" render correctly.
 */
export default function DashboardWithSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-surface="dashboard-v2"
      className="flex min-h-screen bg-[var(--color-mcb-paper)] text-[var(--color-mcb-charcoal)]"
    >
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
