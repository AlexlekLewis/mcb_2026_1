import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
const env=Object.fromEntries(readFileSync(new URL("../.env.local",import.meta.url),"utf8")
 .split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return[l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const sb=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const P="/private/tmp/claude-501/-Users-alexlewis-Documents-Claude-Projects-MCB-WEBSITE-2026/2af11226-2663-4ef9-b5ad-1d41387bd7c9/scratchpad/_pv.json";
const store=JSON.parse(readFileSync(P,"utf8"));
const days=["2026-08-06","2026-08-07","2026-08-08","2026-08-09"];
const cols={page_view:"visitor_id,session_id,page_path,city,region,country,device_type,referrer_url,landing_path,utm_source,utm_medium,utm_campaign,gclid,created_at",scroll_depth:"session_id,scroll_percent,created_at"};
for(const ev of ["page_view","scroll_depth"]){
 for(const d of days){
  const s=d+"T00:00:00Z", e=new Date(new Date(d).getTime()+86400000).toISOString();
  for(let attempt=1;attempt<=4;attempt++){
   let f=0,got=[],ok=true;
   for(;;){
    const {data,error}=await sb.from("analytics_events_clean").select(cols[ev]).eq("event_name",ev)
      .gte("created_at",s).lt("created_at",e).order("created_at",{ascending:true}).range(f,f+499);
    if(error){ok=false;console.error("retry",ev,d,attempt,error.message.slice(0,40));break;}
    got=got.concat(data||[]); if(!data||data.length<500)break; f+=500;
   }
   if(ok){ (ev==="page_view"?store.pv:store.scroll).push(...got); console.error("OK",ev,d,got.length); break; }
   await new Promise(r=>setTimeout(r,1500));
  }
 }
}
store.pv.sort((a,b)=>a.created_at<b.created_at?-1:1);
writeFileSync(P,JSON.stringify(store));
console.error("total pv",store.pv.length,"scroll",store.scroll.length);
