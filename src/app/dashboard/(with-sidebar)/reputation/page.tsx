import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { fetchPendingReviews } from "@/lib/dashboard/v2/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reputation · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function ReputationPage() {
  const pending = await fetchPendingReviews(20);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reputation"
        subtitle="GBP reviews, brand search trend, off-site signals. Full surface wires up in PR 3."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Pending review responses"
          value={pending.length}
          state={pending.length === 0 ? "good" : "attention"}
          footer={pending.length === 0 ? "all caught up" : "respond same-day if possible"}
        />
        <KpiCard
          label="Brand search · 28d"
          value="—"
          footer="awaiting GSC sync (audits/SEARCH_CONSOLE_SETUP.md)"
        />
        <KpiCard
          label="YouTube channel"
          value="—"
          footer="not started — see audits/AI_SEARCH_STRATEGY.md"
        />
      </section>

      {pending.length > 0 && (
        <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Pending responses
          </h2>
          <ul className="mt-4 divide-y divide-[var(--color-mcb-sand-deep)]">
            {pending.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-[var(--color-mcb-charcoal)]">
                    {r.reviewer_name ?? "Anonymous"}
                  </span>
                  {r.rating && (
                    <span className="ml-2 text-[var(--color-mcb-warm-grey)]">{r.rating}★</span>
                  )}
                </div>
                <span className="text-xs text-[var(--color-mcb-warm-grey)]">
                  {r.review_created_at
                    ? new Date(r.review_created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                      })
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        <p>
          <strong>Coming in PR 3:</strong>{" "}
          full review inbox with one-click approve/post (GBP API pull lives in
          the cron — Claude-API auto-draft stays env-gated until you choose to
          enable it), brand search trend chart, YouTube channel metrics
          placeholder.
        </p>
      </aside>
    </div>
  );
}
