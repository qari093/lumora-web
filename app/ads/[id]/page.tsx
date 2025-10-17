"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

function euros(cents:number){ return ; }

export default function CampaignViewPage(){
  const { id } = useParams() as { id: string };
  const [c, setC] = React.useState<any>(null);
  const [err, setErr] = React.useState<string|undefined>();

  React.useEffect(()=>{
    (async ()=>{
      const res = await fetch(, { cache:"no-store" });
      const j = await res.json();
      if(j?.ok) setC(j.campaign); else setErr(j?.error || "Failed");
    })();
  },[id]);

  if(err) return <main style={{ padding:20 }}>❌ {err}</main>;
  if(!c) return <main style={{ padding:20, color:"#9ca3af" }}>Loading...</main>;

  return (
    <main style={{ padding:20, maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h1 style={{ margin:0 }}>{c.title}</h1>
        <div style={{ display:"flex", gap:8 }}>
          <Link href={} style={{ padding:"8px 12px", border:"1px solid #fbbf24", color:"#fbbf24", borderRadius:8, textDecoration:"none" }}>Edit</Link>
          <Link href="/ads" style={{ padding:"8px 12px", border:"1px solid #3b82f6", color:"#3b82f6", borderRadius:8, textDecoration:"none" }}>Back</Link>
        </div>
      </div>

      <div style={{ marginTop:14, display:"grid", gap:10 }}>
        <div>Status: <b>{c.status}</b> • Objective: <b>{c.objective}</b> • Creative: <b>{c.creativeType}</b></div>
        <div>Daily: <b>{euros(c.dailyBudgetCents)}</b> • Total: <b>{euros(c.totalBudgetCents)}</b> • Radius: <b>{c.radiusKm} km</b></div>
        <div>Creative URL: <a href={c.creativeUrl} target="_blank" rel="noreferrer">{c.creativeUrl}</a></div>
        {c.landingUrl && <div>Landing: <a href={c.landingUrl} target="_blank" rel="noreferrer">{c.landingUrl}</a></div>}
        {(c.centerLat!=null && c.centerLon!=null) && <div>Center: {c.centerLat}, {c.centerLon}</div>}
        {c.locationsJson && <pre style={{ background:"#0b0f12", padding:12, borderRadius:8, border:"1px solid #333" }}>{c.locationsJson}</pre>}
      </div>
    </main>
  );
}
