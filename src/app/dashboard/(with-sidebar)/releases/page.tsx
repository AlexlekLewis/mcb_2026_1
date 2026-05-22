import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { ReleaseTracker } from "@/components/dashboard/ReleaseTracker";
import { loadReleaseMetrics } from "@/lib/dashboard/release-metrics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Releases · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function ReleasesPage() {
  const releases = await loadReleaseMetrics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Releases"
        subtitle="Every meaningful change shipped to production, with 24h / 48h / 7d deltas vs the pre-release baseline."
        meta={`${releases.length} ${releases.length === 1 ? "release" : "releases"}`}
      />
      <ReleaseTracker releases={releases} />
      <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        <p>
          New releases are added to{" "}
          <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">
            src/lib/dashboard/releases.ts
          </code>{" "}
          in the same commit as the change itself. See the discipline notes in{" "}
          <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">CLAUDE.md</code>.
        </p>
      </aside>
    </div>
  );
}
