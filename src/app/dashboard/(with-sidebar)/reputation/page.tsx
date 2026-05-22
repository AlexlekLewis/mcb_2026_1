import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { ReviewInbox, AddManualReviewForm } from "@/components/dashboard/v2/ReviewInbox";
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
        subtitle="GBP reviews, response cadence, brand-search trend. Respond same-day where you can — review velocity is the #1 dual-purpose signal for both Local Pack rank and AI citation."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Pending responses"
          value={pending.length}
          state={pending.length === 0 ? "good" : pending.length > 3 ? "critical" : "attention"}
          footer={pending.length === 0 ? "all caught up" : "respond ASAP — velocity matters"}
        />
        <KpiCard
          label="Brand search · 28d"
          value="—"
          footer="awaiting GSC sync (audits/SEARCH_CONSOLE_SETUP.md)"
        />
        <KpiCard
          label="YouTube channel"
          value="—"
          footer="not started — strongest AI Overview correlator per Ahrefs"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-3">
          <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
            Pending review responses
          </h2>
          <ReviewInbox rows={pending} />
        </div>
        <div className="xl:col-span-2">
          <AddManualReviewForm />
        </div>
      </section>
    </div>
  );
}
