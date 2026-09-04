import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env=Object.fromEntries(readFileSync(new URL("../.env.local",import.meta.url),"utf8")
 .split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return[l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const sb=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const DAY=86400000,NOW=Date.now();

// fetch in 5-day chunks to stay under the statement timeout
async function chunked(ev,cols,fromMs,toMs){
  let out=[];
  for(let s=fromMs;s<toMs;s+=5*DAY){
    const e=Math.min(s+5*DAY,toMs);
    let f=0;
    for(;;){
      const {data,error}=await sb.from("analytics_events_clean").select(cols)
        .eq("event_name",ev).gte("created_at",new Date(s).toISOString()).lt("created_at",new Date(e).toISOString())
        .order("created_at",{ascending:true}).range(f,f+999);
      if(error){console.error("ERR",ev,new Date(s).toISOString().slice(0,10),error.message.slice(0,50));break;}
      out=out.concat(data||[]); if(!data||data.length<1000)break; f+=1000;
    }
  }
  return out;
}
const F=NOW-90*DAY;
const pv=await chunked("page_view","visitor_id,session_id,page_path,city,region,country,device_type,referrer_url,landing_path,utm_source,utm_medium,utm_campaign,gclid,created_at",F,NOW);
console.error("page_views fetched:",pv.length);
const scroll=await chunked("scroll_depth","session_id,scroll_percent,created_at",F,NOW);
console.error("scroll fetched:",scroll.length);
writeFileSync("/private/tmp/claude-501/-Users-alexlewis-Documents-Claude-Projects-MCB-WEBSITE-2026/2af11226-2663-4ef9-b5ad-1d41387bd7c9/scratchpad/_pv.json",JSON.stringify({pv,scroll}));
console.error("saved raw");
