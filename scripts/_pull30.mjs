import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; }));
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth:{autoRefreshToken:false,persistSession:false} });

// what tables/views can we see?
const probes = ["analytics_events_clean","lead_submissions","gbp_reviews","bot_crawls","tracked_questions","ai_citations","analytics_events"];
for (const t of probes) {
  const { count, error } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(t.padEnd(28), error ? "ERR " + error.message.slice(0,60) : count);
}
// column shape samples
for (const t of ["analytics_events_clean","lead_submissions"]) {
  const { data } = await sb.from(t).select("*").limit(1);
  console.log("\nCOLS", t, data && data[0] ? Object.keys(data[0]).join(", ") : "(none)");
}
// distinct event names last 90d
const since = new Date(Date.now() - 95*86400000).toISOString();
const { data: evs } = await sb.from("analytics_events_clean").select("event_name").gte("created_at", since).limit(1000);
console.log("\nsample event_names:", [...new Set((evs||[]).map(e=>e.event_name))].join(", "));
