import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(new URL("../.env.local", import.meta.url),"utf8")
  .split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const DAY=86400000, NOW=Date.now();
const since = new Date(NOW-90*DAY).toISOString();

async function all(ev, cols){
  let out=[],f=0;
  for(;;){
    const q = sb.from("analytics_events_clean").select(cols).gte("created_at",since).order("created_at",{ascending:true}).range(f,f+999);
    const {data,error} = ev ? await q.eq("event_name",ev) : await q;
    if(error){console.error("ERR",ev,error.message);break;}
    out=out.concat(data||[]); if(!data||data.length<1000) break; f+=1000;
  }
  return out;
}
const pv    = await all("page_view","visitor_id,session_id,page_path,city,region,country,device_type,browser,referrer_url,landing_path,utm_source,utm_medium,utm_campaign,gclid,created_at");
const taps  = await all("phone_tap","session_id,created_at,page_path");
const ticks = await all("engagement_tick","session_id,engagement_seconds,created_at");
const qcta  = await all("quote_cta_click","session_id,created_at");
const scroll= await all("scroll_depth","session_id,scroll_percent,created_at");
const {data:leadRows} = await sb.from("lead_submissions")
  .select("created_at,gclid,status,tracking_context,suburb,product_interests,is_victoria,source,window_count,project_stage,referral").gte("created_at",since);
const leads=(leadRows||[]).filter(l=>!(l.status&&/spam|junk|test|invalid/i.test(l.status)));

const W=[{k:"P1",f:NOW-30*DAY,t:NOW},{k:"P2",f:NOW-60*DAY,t:NOW-30*DAY},{k:"P3",f:NOW-90*DAY,t:NOW-60*DAY}];
const inW=(ts,w)=>ts>=new Date(w.f).toISOString()&&ts<new Date(w.t).toISOString();
const isAds=l=>{const tc=l.tracking_context||{};const g=l.gclid||tc.gclid||tc.gclidStored;const m=String(tc.utmMedium||"").toLowerCase();return !!g||["cpc","ppc","paid","paidsearch"].includes(m);};
const melbD=t=>new Date(t).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric",timeZone:"Australia/Melbourne"});

function channel(r){
  const m=String(r.utm_medium||"").toLowerCase();
  if(r.gclid||["cpc","ppc","paid","paidsearch"].includes(m)) return "Google Ads (paid)";
  const ref=String(r.referrer_url||"");
  if(!ref) return "Direct / unknown";
  try{const h=new URL(ref).hostname.replace(/^www\./,"");
    if(/google\./.test(h)) return "Google organic";
    if(/bing\.|duckduckgo|yahoo|ecosia|brave/.test(h)) return "Other search";
    if(/facebook|instagram|linkedin|pinterest|tiktok|t\.co|reddit/.test(h)) return "Social";
    if(/chatgpt|openai|perplexity|claude\.ai|gemini|copilot/.test(h)) return "AI assistants";
    if(/moderncurtainsandblinds/.test(h)) return "Direct / unknown";
    return "Referral: "+h;
  }catch{return "Direct / unknown";}
}
const out={generated:new Date().toISOString(),periods:{}};
for(const w of W){
  const p=pv.filter(r=>inW(r.created_at,w));
  const ld=leads.filter(l=>inW(l.created_at,w));
  const tk=ticks.filter(t=>inW(t.created_at,w));
  const per={};for(const t of tk){const s=t.session_id||"?";per[s]=(per[s]||0)+Number(t.engagement_seconds||0);}
  const durs=Object.values(per);
  const sessions=new Set(p.map(r=>r.session_id).filter(Boolean));
  const ads=ld.filter(isAds).length;
  // first pv per session -> channel + landing
  const firstBySes={};for(const r of p){if(!r.session_id)continue;if(!firstBySes[r.session_id])firstBySes[r.session_id]=r;}
  const ch={};for(const r of Object.values(firstBySes)){const c=channel(r);ch[c]=(ch[c]||0)+1;}
  const lp={};for(const r of Object.values(firstBySes)){const k=r.landing_path||r.page_path;lp[k]=(lp[k]||0)+1;}
  const pc={};for(const r of p)pc[r.page_path]=(pc[r.page_path]||0)+1;
  const loc={};for(const r of p){const c=r.city?`${r.city}, ${r.region||""}`.replace(/, $/,""):"Unknown";(loc[c]=loc[c]||new Set()).add(r.visitor_id);}
  const dev={};for(const r of p){const k=r.device_type||"unknown";(dev[k]=dev[k]||new Set()).add(r.session_id);}
  const sesPv={};for(const r of p){if(r.session_id)sesPv[r.session_id]=(sesPv[r.session_id]||0)+1;}
  const bounces=Object.values(sesPv).filter(v=>v===1).length;
  const sc=scroll.filter(s=>inW(s.created_at,w));
  const deep=new Set(sc.filter(s=>Number(s.scroll_percent)>=75).map(s=>s.session_id)).size;
  out.periods[w.k]={
    label:`${melbD(w.f)} – ${melbD(w.t-1)}`,
    pageViews:p.length, visitors:new Set(p.map(r=>r.visitor_id).filter(Boolean)).size, sessions:sessions.size,
    leads:ld.length, adsLeads:ads, organicLeads:ld.length-ads,
    taps:taps.filter(t=>inW(t.created_at,w)).length,
    quoteCtaClicks:qcta.filter(t=>inW(t.created_at,w)).length,
    avgActiveSec:durs.length?Math.round(durs.reduce((a,b)=>a+b,0)/durs.length):0,
    medianActiveSec:durs.length?durs.sort((a,b)=>a-b)[Math.floor(durs.length/2)]:0,
    pagesPerSession:sessions.size?+(p.length/sessions.size).toFixed(2):0,
    bounceRate:sessions.size?+(100*bounces/sessions.size).toFixed(1):0,
    deepScrollSessions:deep,
    vicLeads:ld.filter(l=>l.is_victoria).length,
    channels:Object.entries(ch).sort((a,b)=>b[1]-a[1]),
    landings:Object.entries(lp).sort((a,b)=>b[1]-a[1]).slice(0,12),
    topPages:Object.entries(pc).sort((a,b)=>b[1]-a[1]).slice(0,15),
    topLocations:Object.entries(loc).map(([k,s])=>[k,s.size]).sort((a,b)=>b[1]-a[1]).slice(0,12),
    devices:Object.entries(dev).map(([k,s])=>[k,s.size]).sort((a,b)=>b[1]-a[1]),
    leadDetail:ld.map(l=>({d:l.created_at,ads:isAds(l),suburb:l.suburb,prod:l.product_interests,src:l.source,stage:l.project_stage,windows:l.window_count,ref:l.referral})),
  };
}
// daily series for P1
const daily={};
for(const r of pv){const d=new Date(r.created_at).toLocaleDateString("en-CA",{timeZone:"Australia/Melbourne"});(daily[d]=daily[d]||{pv:0,v:new Set()});daily[d].pv++;daily[d].v.add(r.visitor_id);}
const leadDaily={};for(const l of leads){const d=new Date(l.created_at).toLocaleDateString("en-CA",{timeZone:"Australia/Melbourne"});leadDaily[d]=(leadDaily[d]||0)+1;}
out.daily=Object.entries(daily).sort().map(([d,o])=>({d,pv:o.pv,visitors:o.v.size,leads:leadDaily[d]||0}));
writeFileSync("/private/tmp/claude-501/-Users-alexlewis-Documents-Claude-Projects-MCB-WEBSITE-2026/2af11226-2663-4ef9-b5ad-1d41387bd7c9/scratchpad/mcb30.json",JSON.stringify(out,null,1));
const P=out.periods;
for(const k of ["P1","P2","P3"])console.log(k,P[k].label,"| vis",P[k].visitors,"pv",P[k].pageViews,"ses",P[k].sessions,"leads",P[k].leads,"(ads",P[k].adsLeads,")","taps",P[k].taps,"active",P[k].avgActiveSec+"s","bounce",P[k].bounceRate+"%");
console.log("\nP1 channels:",JSON.stringify(P.P1.channels));
console.log("P2 channels:",JSON.stringify(P.P2.channels));
