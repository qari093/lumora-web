"use client";
import * as React from "react";
export default function CampaignEdit({ params }: { params: { id: string } }){
  const [data,setData] = React.useState<any>(null);
  const [err,setErr] = React.useState<string|null>(null);
  React.useEffect(()=>{
    (async ()=>{
      try{
        const r = await fetch(`/api/campaigns/${encodeURIComponent(params.id)}`, { cache:"no-store" });
        const j = await r.json().catch(()=>null);
        if (!r.ok) throw new Error(j?.error || "Failed");
        setData(j?.campaign || j);
      }catch(e:any){ setErr(e?.message || "Error"); }
    })();
  },[params.id]);
  return (
    <div style={{padding:24}}>
      <h1 style={{marginTop:0}}>Edit Campaign</h1>
      {err && <div style={{color:"crimson"}}>{err}</div>}
      {!err && !data && <div>Loading…</div>}
      {data && (
        <pre style={{background:"#f7f7f7", padding:16, borderRadius:8, overflow:"auto"}}>
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
