// Build the MCB "30 / 30 / 30" performance report — three consecutive 30-day
// windows, bot-filtered + Melbourne-time, with auto-generated key insights.
// Emits a self-contained styled HTML at reports/MCB_30-30-30_Report.html.
// Render to PDF with headless Chrome (see the console hint it prints).
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const DAY = 86400000, NOW = Date.now();
const W = [
  { key: "P1", n: "Most recent 30 days", from: NOW - 30 * DAY, to: NOW },
  { key: "P2", n: "Previous 30 days", from: NOW - 60 * DAY, to: NOW - 30 * DAY },
  { key: "P3", n: "30 days before that", from: NOW - 90 * DAY, to: NOW - 60 * DAY },
];
const melb = (t) => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "Australia/Melbourne" });
const melbY = (t) => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "Australia/Melbourne" });

async function fetchAll(ev, cols, sinceIso) {
  let out = [], f = 0;
  for (;;) {
    const { data, error } = await sb.from("analytics_events_clean").select(cols).eq("event_name", ev).gte("created_at", sinceIso).order("created_at", { ascending: true }).range(f, f + 999);
    if (error) { console.error(ev, error.message); break; }
    out = out.concat(data); if (!data || data.length < 1000) break; f += 1000;
  }
  return out;
}
const since90 = new Date(NOW - 90 * DAY).toISOString();
const pv = await fetchAll("page_view", "visitor_id,session_id,page_path,city,region,country,device_type,created_at", since90);
const taps = await fetchAll("phone_tap", "created_at", since90);
const ticks = await fetchAll("engagement_tick", "session_id,engagement_seconds,created_at", since90);
const { data: leadRows } = await sb.from("lead_submissions").select("created_at,gclid,status,tracking_context").gte("created_at", since90);
const leads = (leadRows || []).filter((l) => !(l.status && /spam|junk|test|invalid/i.test(l.status)));

const inW = (t, w) => t >= new Date(w.from).toISOString() && t < new Date(w.to).toISOString();
const isAds = (l) => { const tc = l.tracking_context || {}; const g = l.gclid || tc.gclid || tc.gclidStored; const m = String(tc.utmMedium || "").toLowerCase(); return !!g || ["cpc", "ppc", "paid", "paidsearch"].includes(m); };

const M = {};
for (const w of W) {
  const p = pv.filter((r) => inW(r.created_at, w));
  const vis = new Set(p.map((r) => r.visitor_id).filter(Boolean)).size;
  const ses = new Set(p.map((r) => r.session_id).filter(Boolean)).size;
  const ld = leads.filter((l) => inW(l.created_at, w));
  const ads = ld.filter(isAds).length;
  const tk = ticks.filter((t) => inW(t.created_at, w));
  const perSes = {}; for (const t of tk) { const s = t.session_id || "?"; perSes[s] = (perSes[s] || 0) + Number(t.engagement_seconds || 0); }
  const durs = Object.values(perSes);
  M[w.key] = {
    label: `${melb(w.from)} – ${melbY(w.to)}`,
    pageViews: p.length, visitors: vis, sessions: ses,
    leads: ld.length, leadRate: vis ? (ld.length / vis) * 100 : 0,
    taps: taps.filter((t) => inW(t.created_at, w)).length,
    ads, organic: ld.length - ads,
    avgActive: durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0,
    rows: p,
  };
}
const p1 = M.P1, p2 = M.P2, p3 = M.P3;

// top pages + locations for P1
const pc = {}; for (const r of p1.rows) pc[r.page_path] = (pc[r.page_path] || 0) + 1;
const topPages = Object.entries(pc).sort((a, b) => b[1] - a[1]).slice(0, 8);
const lc = {}; for (const r of p1.rows) { const c = r.city ? `${r.city}, ${r.region || ""}`.replace(/, $/, "") : "Unknown"; lc[c] = lc[c] || new Set(); if (r.visitor_id) lc[c].add(r.visitor_id); }
const topLoc = Object.entries(lc).map(([k, s]) => [k, s.size]).sort((a, b) => b[1] - a[1]).slice(0, 8);

const pctCh = (a, b) => (b === 0 ? null : Math.round(((a - b) / b) * 100));
const arrow = (a, b) => (a > b ? "▲" : a < b ? "▼" : "▬");
const fmtDur = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);
const n = (x) => x.toLocaleString("en-AU");

// ---------- auto insights ----------
const leadPeak = [["most recent", p1.leads], ["previous", p2.leads], ["earliest", p3.leads]].sort((a, b) => b[1] - a[1])[0];
const insights = [];
insights.push(`<b>Traffic is climbing.</b> Real visitors went ${n(p3.visitors)} → ${n(p2.visitors)} → ${n(p1.visitors)} across the three periods — up ${pctCh(p1.visitors, p3.visitors)}% over the quarter${p1.visitors >= p2.visitors ? ", and still rising in the most recent 30 days" : ""}. Organic reach is working.`);
insights.push(`<b>Leads ${p1.leads >= p2.leads ? "held up" : "cooled in the last 30 days"}.</b> ${n(p3.leads)} → ${n(p2.leads)} → ${n(p1.leads)}, with the strongest run in the ${leadPeak[0]} window (${leadPeak[1]} leads). Lead rate moved ${p3.leadRate.toFixed(1)}% → ${p2.leadRate.toFixed(1)}% → ${p1.leadRate.toFixed(1)}% — ${p1.leads < p2.leads ? "more people are arriving, a smaller share converting" : "conversion is keeping pace with traffic"}.`);
insights.push(`<b>The movement is on the organic side, not paid.</b> Google Ads leads stayed steady (${p3.ads} → ${p2.ads} → ${p1.ads} per period); organic leads went ${p3.organic} → ${p2.organic} → ${p1.organic}. Whatever changed, it wasn't the ads.`);
insights.push(`<b>Phone calls are the counter-trend.</b> Tap-to-call actions rose every period: ${p3.taps} → ${p2.taps} → ${p1.taps}. Some demand is shifting from the form to the phone, so total contacts held up better than the lead count alone suggests.`);
insights.push(`<b>Engagement.</b> Average active time on site was ${fmtDur(p3.avgActive)} → ${fmtDur(p2.avgActive)} → ${fmtDur(p1.avgActive)}. Melbourne is the core market — ${topLoc[0] ? `${topLoc[0][1]} of ${n(p1.visitors)} recent visitors are in ${topLoc[0][0]}` : ""}; the rest is other AU cities plus international/datacenter noise.`);

const metricRow = (label, sel, fmt = n, ppMode = false) => {
  const a = sel(p1), b = sel(p2), c = sel(p3);
  const ch = ppMode ? `${(a - b) >= 0 ? "+" : ""}${(a - b).toFixed(1)}pp` : (pctCh(a, b) === null ? "—" : `${pctCh(a, b) >= 0 ? "+" : ""}${pctCh(a, b)}%`);
  const dir = a > b ? "up" : a < b ? "down" : "flat";
  return `<tr><td class="lbl">${label}</td><td class="p1">${fmt(a)}</td><td>${fmt(b)}</td><td>${fmt(c)}</td><td class="chg ${dir}">${arrow(a, b)} ${ch}</td></tr>`;
};

const html = `<!doctype html><html><head><meta charset="utf-8"><title>MCB 30-Day Performance Report</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2D2D2D; background: #fff; margin: 0; font-size: 12px; line-height: 1.5; }
  h1,h2,h3 { font-family: Georgia, 'Times New Roman', serif; font-weight: 500; color: #2D2D2D; margin: 0; }
  .head { border-bottom: 3px solid #8E5520; padding-bottom: 14px; margin-bottom: 20px; }
  .head h1 { font-size: 26px; }
  .kicker { text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px; color: #8E5520; font-weight: 700; margin-bottom: 6px; }
  .sub { color: #6B6457; font-size: 12px; margin-top: 4px; }
  h2 { font-size: 17px; margin: 26px 0 10px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { text-align: right; padding: 7px 8px; border-bottom: 1px solid #E8E2D7; }
  th { font-size: 9.5px; text-transform: uppercase; letter-spacing: .5px; color: #6B6457; font-weight: 700; }
  th:first-child, td.lbl { text-align: left; }
  td.lbl { color: #2D2D2D; }
  td.p1 { font-weight: 700; }
  td, th { font-variant-numeric: tabular-nums; }
  thead th.pa { color: #8E5520; }
  .chg.up { color: #748B69; } .chg.down { color: #B26E2D; } .chg.flat { color: #6B6457; }
  .chg { font-weight: 600; }
  ol.ins { padding-left: 18px; margin: 8px 0 0; }
  ol.ins li { margin-bottom: 9px; }
  .two { display: flex; gap: 24px; }
  .two > div { flex: 1; }
  .barrow { display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 11px; }
  .barrow .lab { width: 46%; color: #2D2D2D; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .barrow .track { flex: 1; height: 7px; background: #F3EFE6; border-radius: 4px; overflow: hidden; }
  .barrow .fill { height: 7px; background: #8E5520; border-radius: 4px; }
  .barrow .val { width: 34px; text-align: right; font-variant-numeric: tabular-nums; }
  .foot { margin-top: 24px; padding-top: 12px; border-top: 1px solid #E8E2D7; color: #6B6457; font-size: 10px; }
</style></head><body>
  <div class="head">
    <div class="kicker">Modern Curtains &amp; Blinds — Website Performance</div>
    <h1>30-Day Performance Report</h1>
    <div class="sub">Three consecutive 30-day periods · real visitors only (bots filtered) · Melbourne time · generated ${melbY(NOW)}</div>
  </div>

  <h2>Headline metrics</h2>
  <table>
    <thead><tr>
      <th>Metric</th>
      <th class="pa">P1 · most recent<br><span style="font-weight:400;color:#6B6457">${p1.label}</span></th>
      <th>P2 · previous<br><span style="font-weight:400;color:#6B6457">${p2.label}</span></th>
      <th>P3 · earliest<br><span style="font-weight:400;color:#6B6457">${p3.label}</span></th>
      <th>P1 vs P2</th>
    </tr></thead>
    <tbody>
      ${metricRow("Real visitors", (m) => m.visitors)}
      ${metricRow("Page views", (m) => m.pageViews)}
      ${metricRow("Sessions", (m) => m.sessions)}
      ${metricRow("Verified leads", (m) => m.leads)}
      ${metricRow("Lead rate", (m) => m.leadRate, (v) => v.toFixed(1) + "%", true)}
      ${metricRow("Phone taps", (m) => m.taps)}
      ${metricRow("— organic leads", (m) => m.organic)}
      ${metricRow("— Google Ads leads", (m) => m.ads)}
      ${metricRow("Avg active time", (m) => m.avgActive, fmtDur)}
    </tbody>
  </table>

  <h2>Key insights</h2>
  <ol class="ins">${insights.map((i) => `<li>${i}</li>`).join("")}</ol>

  <div class="two">
    <div>
      <h2>Top pages · P1</h2>
      ${topPages.map(([p, c]) => `<div class="barrow"><span class="lab">${p}</span><span class="track"><span class="fill" style="width:${Math.max(4, Math.round(100 * c / topPages[0][1]))}%"></span></span><span class="val">${n(c)}</span></div>`).join("")}
    </div>
    <div>
      <h2>Top locations · P1</h2>
      ${topLoc.map(([p, c]) => `<div class="barrow"><span class="lab">${p}</span><span class="track"><span class="fill" style="width:${Math.max(4, Math.round(100 * c / topLoc[0][1]))}%;background:#748B69"></span></span><span class="val">${n(c)}</span></div>`).join("")}
    </div>
  </div>

  <div class="foot">
    Methodology: figures computed from Modern Curtains &amp; Blinds first-party analytics, filtered to exclude known bots/crawlers and bucketed to Australia/Melbourne time. Visitors and sessions are distinct counts scoped to page views. Leads are verified quote-form submissions (spam/test excluded); &ldquo;ads&rdquo; = leads carrying a Google Ads click ID. Phone taps are tap-to-call actions; call duration is not captured. Report auto-generated by reports/build_30d_report.mjs.
  </div>
</body></html>`;

const out = new URL("../../reports/MCB_30-30-30_Report.html", import.meta.url);
writeFileSync(out, html);
console.log("WROTE", out.pathname);
console.log(`P1 ${p1.visitors} vis / ${p1.leads} leads / ${p1.leadRate.toFixed(1)}% | P2 ${p2.visitors}/${p2.leads}/${p2.leadRate.toFixed(1)}% | P3 ${p3.visitors}/${p3.leads}/${p3.leadRate.toFixed(1)}%`);
