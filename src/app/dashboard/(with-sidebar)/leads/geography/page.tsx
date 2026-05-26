import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import MelbourneMapClient, {
  type MelbourneMapData,
} from "@/components/dashboard/MelbourneMapClient";
import type { MapPoint } from "@/components/dashboard/MelbourneMap";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { resolveLocation } from "@/lib/dashboard/v2/location-resolve";
import {
  GROWTH_CORRIDOR_SUBURBS,
  formatCorridor,
} from "@/lib/growth-corridors";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads · Geography · MCB",
  robots: { index: false, follow: false },
};

export default async function LeadsGeographyPage() {
  const supabase = getSupabaseAdmin();

  // Pull 90d of leads, bucket BY POSTCODE (canonical), look up suburb name +
  // lat/lng via resolveLocation. Postcode is the canonical key because the
  // free-text suburb field is dirty — users type postcodes, partial names,
  // typos, etc. The resolver tries (in order):
  //   1. lead_submissions.postcode column (set on insert)
  //   2. 4-digit run inside the suburb text
  //   3. Suburb name match against LOCATIONS
  let leadPoints: MapPoint[] = [];
  let totalLeads = 0;
  let unresolved = 0;
  if (supabase) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 90);
    const { data } = await supabase
      .from("lead_submissions")
      .select("suburb, postcode")
      .gte("created_at", since.toISOString())
      .limit(2000);

    const rows = (data ?? []) as Array<{ suburb: string | null; postcode: string | null }>;
    totalLeads = rows.length;

    interface Bucket {
      postcode: string;
      suburb: string;
      lat: number;
      lng: number;
      count: number;
    }
    const buckets = new Map<string, Bucket>();
    for (const r of rows) {
      const resolved = resolveLocation({ suburb: r.suburb, postcode: r.postcode });
      if (!resolved) {
        unresolved += 1;
        continue;
      }
      const cur = buckets.get(resolved.postcode) ?? {
        postcode: resolved.postcode,
        suburb: resolved.suburb,
        lat: resolved.latitude,
        lng: resolved.longitude,
        count: 0,
      };
      cur.count += 1;
      buckets.set(resolved.postcode, cur);
    }

    leadPoints = Array.from(buckets.values())
      .map((b) => ({
        lat: b.lat,
        lng: b.lng,
        count: b.count,
        label: `${b.suburb} · ${b.postcode}`,
      }))
      .sort((a, b) => b.count - a.count);
  }

  const mappedLeads = leadPoints.reduce((a, b) => a + b.count, 0);
  const mapData: MelbourneMapData = {
    views: [],
    visitors: [],
    leads: leadPoints,
    phone: [],
    forms: [],
  };

  // Build the growth-corridor postcode rows. Joins our cohort of 12 suburbs
  // against the leadPoints buckets so each row shows lead count even if 0.
  // Sorted by lead count desc, then postcode for stable order.
  const leadCountByPostcode = new Map<string, number>();
  for (const p of leadPoints) {
    // p.label is "Suburb · 3072"; pull the trailing 4-digit run.
    if (!p.label) continue;
    const m = /\b(\d{4})\b\s*$/.exec(p.label);
    if (m) leadCountByPostcode.set(m[1], p.count);
  }

  const growthRows = GROWTH_CORRIDOR_SUBURBS
    .map((s) => ({
      ...s,
      leads90d: leadCountByPostcode.get(s.postcode) ?? 0,
    }))
    .sort((a, b) =>
      b.leads90d !== a.leads90d
        ? b.leads90d - a.leads90d
        : a.postcode.localeCompare(b.postcode),
    );

  const growthTotal = growthRows.reduce((a, b) => a + b.leads90d, 0);
  const growthShareOfMapped =
    mappedLeads > 0 ? Math.round((growthTotal / mappedLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geography"
        subtitle="Where leads came from over the last 90 days. Bucketed by postcode (the canonical location identifier). Bubble size = lead count."
        meta={
          unresolved > 0
            ? `${mappedLeads} of ${totalLeads} leads mapped · ${unresolved} unresolved`
            : `${mappedLeads} leads in ${leadPoints.length} postcodes`
        }
      />

      <div className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-2 overflow-hidden">
        <MelbourneMapClient data={mapData} />
      </div>

      {leadPoints.length > 0 && (
        <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Top postcodes by lead count · 90d
          </h2>
          <ul className="mt-4 divide-y divide-[var(--color-mcb-sand-deep)]">
            {leadPoints.slice(0, 15).map((p) => (
              <li
                key={`${p.lat}-${p.lng}`}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="text-[var(--color-mcb-charcoal)]">{p.label}</span>
                <span className="tabular-nums font-medium">{p.count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Growth-corridor cohort — always rendered, even when 0 leads, so
          the table acts as a watch-list. Tracks the 12 corridor suburbs
          independently of the top-postcodes-by-lead-count list above. */}
      <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Growth-corridor postcodes · 90d
          </h2>
          <span className="text-xs text-[var(--color-mcb-warm-grey)]">
            {growthTotal} lead{growthTotal === 1 ? "" : "s"} across{" "}
            {GROWTH_CORRIDOR_SUBURBS.length} corridor suburbs
            {mappedLeads > 0 ? ` · ${growthShareOfMapped}% of mapped` : ""}
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--color-mcb-warm-grey)]">
          The 12 corridor suburbs the AI-content + growth-corridor strategy
          targets specifically. Tracked separately from the broader top-postcodes
          list above so corridor performance is visible even when leads come from
          elsewhere. Postcode set lives in{" "}
          <code className="font-mono text-[11px] text-[var(--color-mcb-charcoal)]">
            src/lib/growth-corridors.ts
          </code>
          .
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
                <th className="py-2 pr-3 font-semibold">Suburb</th>
                <th className="py-2 pr-3 font-semibold">Postcode</th>
                <th className="py-2 pr-3 font-semibold">Corridor</th>
                <th className="py-2 pr-3 font-semibold text-right">Leads · 90d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
              {growthRows.map((row) => (
                <tr key={row.slug}>
                  <td className="py-2 pr-3 text-[var(--color-mcb-charcoal)]">
                    {row.name}
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs text-[var(--color-mcb-warm-grey)]">
                    {row.postcode}
                  </td>
                  <td className="py-2 pr-3 text-xs text-[var(--color-mcb-warm-grey)]">
                    {formatCorridor(row.corridor)}
                  </td>
                  <td
                    className={
                      "py-2 pr-3 text-right tabular-nums " +
                      (row.leads90d > 0
                        ? "font-medium text-[var(--color-mcb-charcoal)]"
                        : "text-[var(--color-mcb-warm-grey-light)]")
                    }
                  >
                    {row.leads90d}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {unresolved > 0 && (
        <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
          {unresolved} {unresolved === 1 ? "lead has" : "leads have"} a suburb value
          that the postcode resolver couldn&apos;t map (typo, non-VIC postcode,
          unfamiliar locality). Future submissions resolve at insert time via
          the new <code className="font-mono text-xs">postcode</code> column.
        </aside>
      )}

      {leadPoints.length === 0 && totalLeads === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
          No leads in the last 90 days.
        </p>
      )}
    </div>
  );
}
