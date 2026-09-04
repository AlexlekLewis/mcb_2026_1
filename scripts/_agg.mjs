import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env=Object.fromEntries(readFileSync(new URL("../.env.local",import.meta.url),"utf8")
 .split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return[l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const sb=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const SP="/private/tmp/claude-501/-Users-alexlewis-Documents-Claude-Projects-MCB-WEBSITE-2026/2af11226-2663-4ef9-b5ad-1d41387bd7c9/scratchpad/";
const {pv,scroll}=JSON.parse(readFileSync(SP+"_pv.json","utf8"));
const DAY=86400000,NOW=Date.now(),F=NOW-90*DAY;
async function chunked(ev,cols){let out=[];for(let s=F;s<NOW;s+=5*DAY){const e=Math.min(s+5*DAY,NOW);let f=0;
 for(;;){const{data,error}=await sb.from("analytics_events_clean").select(cols).eq("event_name",ev)
   .gte("created_at",new Date(s).toISOString()).lt("created_at",new Date(e).toISOString()).order("created_at",{ascending:true}).range(f,f+999);
  if(error){console.error("ERR",ev,new Date(s).toISOString().slice(0,10),error.message.slice(0,40));break;}
  out=out.concat(data||[]);if(!data||data.length<1000)break;f+=1000;}}return out;}
const taps=await chunked("phone_tap","session_id,created_at,page_path");
const ticks=await chunked("engagement_tick","session_id,engagement_seconds,created_at");
const qcta=await chunked("quote_cta_click","session_id,created_at");
const {data:leadRows}=await sb.from("lead_submissions").select("created_at,gclid,status,tracking_context,suburb,product_interests,is_victoria,source,window_count,project_stage,referral").gte("created_at",new Date(F).toISOString());
const leads=(leadRows||[]).filter(l=>!(l.status&&/spam|junk|test|invalid/i.test(l.status)));
console.error("taps",taps.length,"ticks",ticks.length,"qcta",qcta.length,"leads",leads.length);

const W=[{k:"P1",f:NOW-30*DAY,t:NOW},{k:"P2",f:NOW-60*DAY,t:NOW-30*DAY},{k:"P3",f:NOW-90*DAY,t:NOW-60*DAY}];
const inW=(ts,w)=>ts>=new Date(w.f).toISOString()&&ts<new Date(w.t).toISOString();
const isAds=l=>{const tc=l.tracking_context||{};const g=l.gclid||tc.gclid||tc.gclidStored;const m=String(tc.utmMedium||"").toLowerCase();return !!g||["cpc","ppc","paid","paidsearch"].includes(m);};
const melbD=t=>new Date(t).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric",timeZone:"Australia/Melbourne"});
function channel(r){const m=String(r.utm_medium||"").toLowerCase();
 if(r.gclid||["cpc","ppc","paid","paidsearch"].includes(m))return "Google Ads (paid)";
 const ref=String(r.referrer_url||"");if(!ref)return "Direct / unknown";
 try{const h=new URL(ref).hostname.replace(/^www\./,"");
  if(/moderncurtainsandblinds/.test(h))return "Direct / unknown";
  if(/google\./.test(h))return "Google organic";
  if(/bing\.|duckduckgo|yahoo|ecosia|brave/.test(h))return "Other search";
  if(/facebook|instagram|linkedin|pinterest|tiktok|t\.co|reddit/.test(h))return "Social";
  if(/chatgpt|openai|perplexity|claude\.ai|gemini|copilot/.test(h))return "AI assistants";
  return "Referral: "+h;}catch{return "Direct / unknown";}}
const out={generated:new Date().toISOString(),periods:{}};
for(const w of W){
 const p=pv.filter(r=>inW(r.created_at,w)), ld=leads.filter(l=>inW(l.created_at,w));
 const tk=ticks.filter(t=>inW(t.created_at,w));
 const per={};for(const t of tk){const s=t.session_id||"?";per[s]=(per[s]||0)+Number(t.engagement_seconds||0);}
 const durs=Object.values(per).sort((a,b)=>a-b);
 const ses=new Set(p.map(r=>r.session_id).filter(Boolean));
 const firstBySes={};for(const r of p){if(r.session_id&&!firstBySes[r.session_id])firstBySes[r.session_id]=r;}
 const ch={},lp={},pc={},loc={},dev={};
 for(const r of Object.values(firstBySes)){const c=channel(r);ch[c]=(ch[c]||0)+1;const k=r.landing_path||r.page_path;lp[k]=(lp[k]||0)+1;}
 for(const r of p){pc[r.page_path]=(pc[r.page_path]||0)+1;
  const c=r.city?`${r.city}, ${r.region||""}`.replace(/, $/,""):"Unknown";(loc[c]=loc[c]||new Set()).add(r.visitor_id);
  (dev[r.device_type||"unknown"]=dev[r.device_type||"unknown"]||new Set()).add(r.session_id);}
 const sesPv={};for(const r of p)if(r.session_id)sesPv[r.session_id]=(sesPv[r.session_id]||0)+1;
 const sc=scroll.filter(s=>inW(s.created_at,w));
 out.periods[w.k]={label:`${melbD(w.f)} – ${melbD(w.t-1)}`,
  pageViews:p.length,visitors:new Set(p.map(r=>r.visitor_id).filter(Boolean)).size,sessions:ses.size,
  leads:ld.length,adsLeads:ld.filter(isAds).length,organicLeads:ld.length-ld.filter(isAds).length,
  taps:taps.filter(t=>inW(t.created_at,w)).length,quoteCta:qcta.filter(t=>inW(t.created_at,w)).length,
  avgActiveSec:durs.length?Math.round(durs.reduce((a,b)=>a+b,0)/durs.length):0,
  medActiveSec:durs.length?durs[Math.floor(durs.length/2)]:0,
  pagesPerSession:ses.size?+(p.length/ses.size).toFixed(2):0,
  bounceRate:ses.size?+(100*Object.values(sesPv).filter(v=>v===1).length/ses.size).toFixed(1):0,
  deepScrollSessions:new Set(sc.filter(s=>Number(s.scroll_percent)>=75).map(s=>s.session_id)).size,
  vicLeads:ld.filter(l=>l.is_victoria).length,
  channels:Object.entries(ch).sort((a,b)=>b[1]-a[1]),
  landings:Object.entries(lp).sort((a,b)=>b[1]-a[1]).slice(0,12),
  topPages:Object.entries(pc).sort((a,b)=>b[1]-a[1]).slice(0,15),
  topLocations:Object.entries(loc).map(([k,s])=>[k,s.size]).sort((a,b)=>b[1]-a[1]).slice(0,12),
  devices:Object.entries(dev).map(([k,s])=>[k,s.size]).sort((a,b)=>b[1]-a[1]),
  leadDetail:ld.map(l=>({d:l.created_at,ads:isAds(l),suburb:l.suburb,prod:l.product_interests,src:l.source,stage:l.project_stage,windows:l.window_count,ref:l.referral})),
 };
}
const dm=t=>new Date(t).toLocaleDateString("en-CA",{timeZone:"Australia/Melbourne"});
const daily={};for(const r of pv){const d=dm(r.created_at);(daily[d]=daily[d]||{pv:0,v:new Set()});daily[d].pv++;daily[d].v.add(r.visitor_id);}
const ldD={};for(const l of leads){const d=dm(l.created_at);ldD[d]=(ldD[d]||0)+1;}
out.daily=Object.entries(daily).sort().map(([d,o])=>({d,pv:o.pv,visitors:o.v.size,leads:ldD[d]||0}));
writeFileSync(SP+"mcb30.json",JSON.stringify(out,null,1));
const P=out.periods;
for(const k of["P1","P2","P3"]){const m=P[k];console.log(k,m.label,"| vis",m.visitors,"pv",m.pageViews,"ses",m.sessions,"| leads",m.leads,"(ads",m.adsLeads,"org",m.organicLeads,") taps",m.taps,"| active",m.avgActiveSec+"s med",m.medActiveSec+"s pps",m.pagesPerSession,"bounce",m.bounceRate+"%");}
console.log("\nCHANNELS");for(const k of["P1","P2","P3"])console.log(k,JSON.stringify(P[k].channels));
