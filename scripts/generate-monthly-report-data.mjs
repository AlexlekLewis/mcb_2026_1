import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const NOW = new Date();
const curSince = new Date(NOW.getTime() - 30 * 86400000);
const prevSince = new Date(NOW.getTime() - 60 * 86400000);
const curSinceIso = curSince.toISOString();
const prevSinceIso = prevSince.toISOString();

const mel = new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit" });
const melDate = (iso) => mel.format(new Date(iso));
const melHour = (iso) => parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: "Australia/Melbourne", hour: "2-digit", hour12: false }).format(new Date(iso)), 10);
const melDow = (iso) => new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Melbourne", weekday: "short" }).format(new Date(iso));

const CLEAN_COLS = "created_at,event_name,visitor_id,session_id,page_path,city,region,country,device_type,browser,os,scroll_percent,engagement_seconds,gclid,fbclid,utm_source,utm_medium,utm_campaign,referrer_url,landing_path,properties";

async function pullClean(fromIso, toIso) {
  const all = []; const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    let q = supabase.from("analytics_events_clean").select(CLEAN_COLS)
      .gte("created_at", fromIso).order("created_at", { ascending: true }).range(from, from + PAGE - 1);
    if (toIso) q = q.lt("created_at", toIso);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    all.push(...data);
    if (data.length < PAGE) break;
  }
  return all;
}
async function pullLeads(fromIso, toIso) {
  let q = supabase.from("lead_submissions").select("*").gte("created_at", fromIso).order("created_at", { ascending: false });
  if (toIso) q = q.lt("created_at", toIso);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

const [curEvents, prevEvents, curLeads, prevLeads] = await Promise.all([
  pullClean(curSinceIso, null),
  pullClean(prevSinceIso, curSinceIso),
  pullLeads(curSinceIso, null),
  pullLeads(prevSinceIso, curSinceIso),
]);

const inc = (m, k, x = 1) => m.set(k, (m.get(k) || 0) + x);
const addSet = (m, k, v) => { if (!m.has(k)) m.set(k, new Set()); if (v != null) m.get(k).add(v); };

function leadSource(l) {
  const tc = l.tracking_context || {};
  if (l.gclid || tc.gclid) return "Google Ads (gclid)";
  const u = tc.utmSource || tc.utm_source;
  if (u) return `utm:${u}`;
  if (l.referral) return `referral:${l.referral}`;
  return l.source || "unknown";
}
function leadChannel(l) {
  const s = leadSource(l);
  if (s === "Google Ads (gclid)") return "Google Ads (paid)";
  if (s === "referral:Google Search") return "Google (organic)";
  if (s.includes("AI search") || s === "utm:chatgpt.com" || s.includes("chatgpt")) return "AI search";
  if (s.includes("Facebook") || s.includes("Instagram")) return "Social";
  if (s.includes("Friend") || s.includes("family")) return "Referral (word of mouth)";
  return "Other";
}

function summarize(events, leads) {
  const pv = events.filter((e) => e.event_name === "page_view");
  const visitors = new Set(pv.map((e) => e.visitor_id).filter(Boolean)).size;
  const sessions = new Set(pv.map((e) => e.session_id).filter(Boolean)).size;
  const activeDays = new Set(pv.map((e) => melDate(e.created_at))).size;

  const sess = new Map();
  for (const e of events) {
    if (!e.session_id) continue;
    if (!sess.has(e.session_id)) sess.set(e.session_id, { pv: 0, engaged: 0, maxScroll: 0, device: null });
    const s = sess.get(e.session_id);
    if (e.event_name === "page_view") s.pv++;
    if (e.event_name === "engagement_tick") s.engaged += e.engagement_seconds || 0;
    if (e.event_name === "scroll_depth" && e.scroll_percent != null) s.maxScroll = Math.max(s.maxScroll, e.scroll_percent);
    if (!s.device && e.device_type) s.device = e.device_type;
  }
  const S = [...sess.values()];
  const withPv = S.filter((s) => s.pv >= 1);
  const avgEngaged = Math.round(S.reduce((a, s) => a + s.engaged, 0) / (S.length || 1));
  const bounce = withPv.filter((s) => s.pv === 1).length / (withPv.length || 1);
  const pps = withPv.reduce((a, s) => a + s.pv, 0) / (withPv.length || 1);
  const scrollS = S.filter((s) => s.maxScroll > 0);
  const avgScroll = Math.round(scrollS.reduce((a, s) => a + s.maxScroll, 0) / (scrollS.length || 1));
  const mobile = S.filter((s) => s.device === "mobile").length;
  const mobileShare = mobile / (S.filter((s) => s.device).length || 1);

  const phone = events.filter((e) => e.event_name === "phone_tap");
  const leadCh = new Map();
  for (const l of leads) inc(leadCh, leadChannel(l));

  return {
    page_views: pv.length, visitors, sessions, active_days: activeDays,
    first_event: events[0]?.created_at || null, last_event: events[events.length - 1]?.created_at || null,
    phone_taps: phone.length, phone_taps_gclid: phone.filter((e) => e.gclid).length,
    quote_cta_clicks: events.filter((e) => e.event_name === "quote_cta_click").length,
    quote_form_starts: events.filter((e) => e.event_name === "quote_form_start").length,
    quote_submits: events.filter((e) => e.event_name === "quote_step_3_submit").length,
    quote_success: events.filter((e) => e.event_name === "quote_success").length,
    leads: leads.length,
    leads_vic: leads.filter((l) => l.is_victoria === true).length,
    leads_spam: leads.filter((l) => l.status === "spam").length,
    leads_gclid: leads.filter((l) => l.gclid || (l.tracking_context || {}).gclid).length,
    lead_rate_on_sessions: leads.length / (sessions || 1),
    avg_engaged_seconds: avgEngaged, bounce_rate: bounce, avg_pages_per_session: +pps.toFixed(2),
    avg_max_scroll: avgScroll, mobile_share: mobileShare,
    lead_channels: [...leadCh.entries()].map(([k, v]) => ({ channel: k, count: v })).sort((a, b) => b.count - a.count),
  };
}

const cur = summarize(curEvents, curLeads);
const prev = summarize(prevEvents, prevLeads);

// ===== detailed current-period sections =====
const events = curEvents; const leads = curLeads;
const pv = events.filter((e) => e.event_name === "page_view");

const daily = new Map();
for (const e of events) {
  const d = melDate(e.created_at);
  if (!daily.has(d)) daily.set(d, { date: d, page_views: 0, visitors: new Set(), sessions: new Set(), phone_taps: 0, quote_success: 0 });
  const row = daily.get(d);
  if (e.event_name === "page_view") { row.page_views++; if (e.visitor_id) row.visitors.add(e.visitor_id); if (e.session_id) row.sessions.add(e.session_id); }
  if (e.event_name === "phone_tap") row.phone_taps++;
  if (e.event_name === "quote_success") row.quote_success++;
}
const leadsByDate = new Map(); for (const l of leads) inc(leadsByDate, melDate(l.created_at));
const dailyArr = [...daily.values()].map((r) => ({ date: r.date, page_views: r.page_views, visitors: r.visitors.size, sessions: r.sessions.size, phone_taps: r.phone_taps, quote_success: r.quote_success, leads: leadsByDate.get(r.date) || 0 })).sort((a, b) => a.date.localeCompare(b.date));

const sMap = new Map();
for (const e of events) {
  if (!e.session_id) continue;
  if (!sMap.has(e.session_id)) sMap.set(e.session_id, { engaged: 0, maxScroll: 0, device: null });
  const s = sMap.get(e.session_id);
  if (e.event_name === "engagement_tick") s.engaged += e.engagement_seconds || 0;
  if (e.event_name === "scroll_depth" && e.scroll_percent != null) s.maxScroll = Math.max(s.maxScroll, e.scroll_percent);
  if (!s.device && e.device_type) s.device = e.device_type;
}
const sess = [...sMap.values()];
const engBuckets = { "0-10s": 0, "10-30s": 0, "30-60s": 0, "1-3min": 0, "3min+": 0 };
for (const s of sess) { const e = s.engaged; if (e < 10) engBuckets["0-10s"]++; else if (e < 30) engBuckets["10-30s"]++; else if (e < 60) engBuckets["30-60s"]++; else if (e < 180) engBuckets["1-3min"]++; else engBuckets["3min+"]++; }
const scrollSessions = sess.filter((s) => s.maxScroll > 0);
const scrollThresholds = { 25: 0, 50: 0, 75: 0, 100: 0 };
for (const s of scrollSessions) for (const t of [25, 50, 75, 100]) if (s.maxScroll >= t) scrollThresholds[t]++;

const pageMap = new Map();
for (const e of events) {
  if (!e.page_path) continue;
  if (!pageMap.has(e.page_path)) pageMap.set(e.page_path, { page_path: e.page_path, page_views: 0, visitors: new Set(), quote_clicks: 0, phone_taps: 0, scrollSum: 0, scrollN: 0 });
  const p = pageMap.get(e.page_path);
  if (e.event_name === "page_view") { p.page_views++; if (e.visitor_id) p.visitors.add(e.visitor_id); }
  if (e.event_name === "quote_cta_click") p.quote_clicks++;
  if (e.event_name === "phone_tap") p.phone_taps++;
  if (e.event_name === "scroll_depth" && e.scroll_percent != null) { p.scrollSum += e.scroll_percent; p.scrollN++; }
}
const pageSessionEng = new Map();
for (const e of events) {
  if (e.event_name !== "engagement_tick" || !e.page_path || !e.session_id) continue;
  if (!pageSessionEng.has(e.page_path)) pageSessionEng.set(e.page_path, new Map());
  const m = pageSessionEng.get(e.page_path); m.set(e.session_id, (m.get(e.session_id) || 0) + (e.engagement_seconds || 0));
}
const topPages = [...pageMap.values()].map((p) => {
  const engM = pageSessionEng.get(p.page_path); const ev = engM ? [...engM.values()] : [];
  return { page_path: p.page_path, page_views: p.page_views, visitors: p.visitors.size, quote_clicks: p.quote_clicks, phone_taps: p.phone_taps, avg_scroll: p.scrollN ? Math.round(p.scrollSum / p.scrollN) : 0, avg_engaged_s: ev.length ? Math.round(ev.reduce((a, b) => a + b, 0) / ev.length) : 0 };
}).filter((p) => p.page_views > 0).sort((a, b) => b.page_views - a.page_views).slice(0, 15);

const locMap = new Map();
for (const e of pv) {
  const city = (e.city || "Unknown").trim() || "Unknown"; const region = (e.region || "").trim();
  const key = city + "|" + region;
  if (!locMap.has(key)) locMap.set(key, { city, region, visitors: new Set(), sessions: new Set(), page_views: 0 });
  const l = locMap.get(key); l.page_views++; if (e.visitor_id) l.visitors.add(e.visitor_id); if (e.session_id) l.sessions.add(e.session_id);
}
const cityConv = new Map();
for (const e of events) {
  if (e.event_name !== "phone_tap" && e.event_name !== "quote_cta_click") continue;
  const city = (e.city || "Unknown").trim() || "Unknown";
  if (!cityConv.has(city)) cityConv.set(city, { taps: 0, clicks: 0 });
  if (e.event_name === "phone_tap") cityConv.get(city).taps++; else cityConv.get(city).clicks++;
}
const locations = [...locMap.values()].map((l) => ({ city: l.city, region: l.region, visitors: l.visitors.size, sessions: l.sessions.size, page_views: l.page_views, phone_taps: cityConv.get(l.city)?.taps || 0, quote_clicks: cityConv.get(l.city)?.clicks || 0 })).sort((a, b) => b.visitors - a.visitors).slice(0, 25);

const srcSess = new Map(); const srcVis = new Map();
function sessSrc(e) { if (e.gclid) return "Google Ads (gclid)"; if (e.utm_source) return `utm:${e.utm_source}`; if (!e.referrer_url) return "Direct / none"; const m = e.referrer_url.match(/^https?:\/\/([^/]+)/); return m ? m[1].replace(/^www\./, "") : "unknown"; }
const sessionFirst = new Map();
for (const e of events) { if (!e.session_id) continue; if (!sessionFirst.has(e.session_id)) sessionFirst.set(e.session_id, sessSrc(e)); }
for (const src of sessionFirst.values()) inc(srcSess, src);
for (const e of pv) addSet(srcVis, sessSrc(e), e.visitor_id);
const sources = [...srcSess.entries()].map(([source, s]) => ({ source, sessions: s, visitors: srcVis.get(source)?.size || 0 })).sort((a, b) => b.sessions - a.sessions);

const devMap = new Map(); const devBySession = new Map();
for (const e of events) { if (e.session_id && e.device_type && !devBySession.has(e.session_id)) devBySession.set(e.session_id, e.device_type); }
for (const d of devBySession.values()) inc(devMap, d);
const browMap = new Map(); const seenB = new Set();
for (const e of pv) { if (e.browser && e.session_id && !seenB.has(e.session_id)) { seenB.add(e.session_id); inc(browMap, e.browser); } }

const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, page_views: 0 }));
const dow = new Map();
for (const e of pv) { hourly[melHour(e.created_at)].page_views++; inc(dow, melDow(e.created_at)); }

const leadRows = leads.map((l) => ({ date: melDate(l.created_at), suburb: l.suburb, is_victoria: l.is_victoria, products: l.product_interests || [], source: l.source, status: l.status, gclid: l.gclid || (l.tracking_context || {}).gclid || null, referral: l.referral }));
const leadBySource = new Map(); for (const l of leads) inc(leadBySource, leadSource(l));
const leadByProduct = new Map(); for (const l of leads) for (const p of ((l.product_interests || []).length ? l.product_interests : ["(none)"])) inc(leadByProduct, p);
const phoneTaps = events.filter((e) => e.event_name === "phone_tap").map((e) => ({ date: melDate(e.created_at), city: e.city, page_path: e.page_path, device: e.device_type, gclid: e.gclid || null, referrer_url: e.referrer_url || null }));

const SRC_LABEL = {
  "referral:Google Search": "Google — organic search",
  "Google Ads (gclid)": "Google Ads — paid (gclid-verified)",
  "referral:AI search (ChatGPT, Gemini, Claude, etc.)": "AI search (ChatGPT / Gemini / Claude)",
  "utm:chatgpt.com": "AI search (ChatGPT — referrer)",
  "referral:Other": "Other", "referral:Facebook or Instagram": "Facebook / Instagram",
  "referral:Friend or family referral": "Friend / family referral",
};

const result = {
  meta: { generated_at: NOW.toISOString(), window_days: 30, current_since: curSinceIso, previous_since: prevSinceIso, events_current: curEvents.length, events_previous: prevEvents.length },
  comparison: { current: cur, previous: prev },
  totals: {
    page_views: cur.page_views, visitors: cur.visitors, sessions: cur.sessions,
    phone_taps: cur.phone_taps, phone_taps_gclid: cur.phone_taps_gclid,
    quote_cta_clicks: cur.quote_cta_clicks, quote_form_starts: cur.quote_form_starts,
    quote_submits: cur.quote_submits, quote_success: cur.quote_success,
    leads: cur.leads, leads_prior_30d: prev.leads,
    avg_engaged_seconds: cur.avg_engaged_seconds, avg_pages_per_session: cur.avg_pages_per_session,
    bounce_rate: cur.bounce_rate, avg_max_scroll: cur.avg_max_scroll, lead_rate_on_sessions: cur.lead_rate_on_sessions,
  },
  daily: dailyArr, top_pages: topPages, locations, sources,
  devices: [...devMap.entries()].map(([k, v]) => ({ device: k, sessions: v })).sort((a, b) => b.sessions - a.sessions),
  browsers: [...browMap.entries()].map(([k, v]) => ({ browser: k, sessions: v })).sort((a, b) => b.sessions - a.sessions).slice(0, 8),
  hourly, dow: [...dow.entries()].map(([k, v]) => ({ dow: k, page_views: v })),
  scroll: { avg_max_scroll: cur.avg_max_scroll, thresholds: scrollThresholds, scroll_tracked_sessions: scrollSessions.length },
  engagement: { avg_engaged_seconds: cur.avg_engaged_seconds, buckets: engBuckets, sessions_total: sess.length, bounce_rate: cur.bounce_rate },
  funnel: [
    { stage: "Page views", total: cur.page_views },
    { stage: "Quote CTA clicks", total: cur.quote_cta_clicks },
    { stage: "Quote form starts", total: cur.quote_form_starts },
    { stage: "Quote submits (step 3)", total: cur.quote_submits },
    { stage: "Quote successes", total: cur.quote_success },
    { stage: "Stored leads", total: cur.leads },
  ],
  leads: {
    total: cur.leads, prior_30d: prev.leads, vic: cur.leads_vic,
    vic_unknown: leads.filter((l) => l.is_victoria == null).length, spam: cur.leads_spam,
    gclid_leads: cur.leads_gclid, with_contact: leads.filter((l) => l.email || l.phone).length,
    by_source: [...leadBySource.entries()].map(([k, v]) => ({ source: k, label: SRC_LABEL[k] || k.replace("referral:", "").replace("utm:", "utm: "), count: v })).sort((a, b) => b.count - a.count),
    by_product: [...leadByProduct.entries()].map(([k, v]) => ({ product: k, count: v })).sort((a, b) => b.count - a.count),
    rows: leadRows,
  },
  phone_taps_detail: { total: phoneTaps.length, gclid: cur.phone_taps_gclid, rows: phoneTaps },
};

writeFileSync(new URL("../../reports/mcb_report_data.json", import.meta.url), JSON.stringify(result, null, 2));
console.log("WROTE reports/mcb_report_data.json");
console.log("CURRENT :", `leads ${cur.leads} | taps ${cur.phone_taps} | visitors ${cur.visitors} | sessions ${cur.sessions} | pv ${cur.page_views} | activeDays ${cur.active_days} | ${cur.first_event?.slice(0,10)}->${cur.last_event?.slice(0,10)}`);
console.log("PREVIOUS:", `leads ${prev.leads} | taps ${prev.phone_taps} | visitors ${prev.visitors} | sessions ${prev.sessions} | pv ${prev.page_views} | activeDays ${prev.active_days} | ${prev.first_event?.slice(0,10)}->${prev.last_event?.slice(0,10)}`);
console.log("delta leads:", (((cur.leads-prev.leads)/prev.leads)*100).toFixed(0)+"%", "| delta visitors:", (((cur.visitors-prev.visitors)/prev.visitors)*100).toFixed(0)+"%", "| delta pv:", (((cur.page_views-prev.page_views)/prev.page_views)*100).toFixed(0)+"%");
