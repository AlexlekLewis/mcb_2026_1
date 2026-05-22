import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explorer · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default function ExplorerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Explorer"
        subtitle="Reference data — useful occasionally, demoted from the main flow so the day-to-day surfaces stay decision-focused."
      />

      <section className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white p-6">
        <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
          Where to find the demoted data
        </h2>
        <p className="mt-2 text-sm text-[var(--color-mcb-warm-grey)]">
          The legacy 1540-line single-page dashboard had pages, devices,
          browsers, countries, traffic sources and the hourly heatmap all on
          the home view. At MCB&apos;s volume those panels were noise; they&apos;re
          being moved here as power-user views in PR 3.
        </p>
        <p className="mt-3 text-sm text-[var(--color-mcb-warm-grey)]">
          For now the legacy page is preserved at{" "}
          <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">
            src/app/dashboard/_legacy/page.tsx
          </code>{" "}
          (underscore prefix = non-routable in Next.js App Router). Two weeks
          after PR 3 ships and Explorer surfaces all this data properly, it
          gets deleted.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block text-sm font-medium text-[var(--color-mcb-terracotta-deep)] hover:text-[#6F4218]"
        >
          ← Back to Home
        </Link>
      </section>
    </div>
  );
}
