import type { ReactNode } from "react";
import { TabNav } from "@/components/dashboard/v2/TabNav";

const TABS = [
  { href: "/dashboard/leads",           label: "Overview" },
  { href: "/dashboard/leads/geography", label: "Geography" },
];

export default function LeadsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <TabNav tabs={TABS} ariaLabel="Leads sub-sections" />
      {children}
    </div>
  );
}
