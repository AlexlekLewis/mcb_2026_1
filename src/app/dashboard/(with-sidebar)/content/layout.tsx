import type { ReactNode } from "react";
import { TabNav } from "@/components/dashboard/v2/TabNav";

const TABS = [
  { href: "/dashboard/content",               label: "Overview" },
  { href: "/dashboard/content/suburb-audit",  label: "Suburb audit" },
];

export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <TabNav tabs={TABS} ariaLabel="Content sub-sections" />
      {children}
    </div>
  );
}
