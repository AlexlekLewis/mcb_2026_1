import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import MelbourneMapClient, {
  type MelbourneMapData,
} from "@/components/dashboard/MelbourneMapClient";
import type { MapPoint } from "@/components/dashboard/MelbourneMap";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { LOCATIONS } from "@/lib/locations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads · Geography · MCB",
  robots: { index: false, follow: false },
};

interface LeadGeoRow {
  suburb: string | null;
  count: number;
}

export default async function LeadsGeographyPage() {
  const supabase = getSupabaseAdmin();

  // Pull 90d of lead suburbs, bucket to suburb → count, look up lat/lng from
  // LOCATIONS. The 5-layer map of the legacy view (views/visitors/leads/
  // phone/forms) was overkill at MCB's volume — Geography here shows leads
  // only, which is the only signal that actually informs decisions.
  let leadPoints: MapPoint[] = [];
  if (supabase) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 90);
    const { data } = await supabase
      .from("lead_submissions")
      .select("suburb")
      .gte("created_at", since.toISOString())
      .limit(2000);

    const rows = (data ?? []) as Array<{ suburb: string | null }>;
    const buckets = new Map<string, LeadGeoRow>();
    for (const r of rows) {
      const key = (r.suburb ?? "").trim().toLowerCase();
      if (!key) continue;
      const cur = buckets.get(key) ?? { suburb: key, count: 0 };
      cur.count += 1;
      buckets.set(key, cur);
    }

    for (const [key, entry] of buckets.entries()) {
      const loc =
        LOCATIONS.find((l) => l.slug === key) ??
        LOCATIONS.find((l) => l.name.toLowerCase() === key);
      if (!loc) continue;
      leadPoints.push({
        lat: loc.latitude,
        lng: loc.longitude,
        count: entry.count,
        label: loc.name,
      });
    }
    leadPoints = leadPoints.sort((a, b) => b.count - a.count);
  }

  const mapData: MelbourneMapData = {
    views: [],
    visitors: [],
    leads: leadPoints,
    phone: [],
    forms: [],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geography"
        subtitle="Where leads came from over the last 90 days. Bubble size = lead count."
        meta={`${leadPoints.reduce((a, b) => a + b.count, 0)} leads in ${leadPoints.length} suburbs`}
      />

      <div className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-2 overflow-hidden">
        <MelbourneMapClient data={mapData} />
      </div>

      {leadPoints.length > 0 && (
        <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Top suburbs by lead count · 90d
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

      {leadPoints.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
          No suburb-tagged leads in the last 90 days. The map renders when
          lead_submissions rows have a recognisable suburb that matches the
          LOCATIONS dataset.
        </p>
      )}
    </div>
  );
}
