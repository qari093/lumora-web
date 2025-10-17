"use client";
import React from "react";

export default function AdsAdminPage(){
  const [rep,setRep]=React.useState<any>(null);
  const [ab,setAB]=React.useState<any>(null);
  const [live,setLive]=React.useState<any>(null);
  React.useEffect(()=>{
    fetch("/api/ads/report").then(r=>r.json()).then(setRep);
    fetch("/api/ads/ab").then(r=>r.json()).then(setAB);
    const es = new EventSource("/api/ads/stream");
    es.onmessage = (ev)=>{ try{ const j=JSON.parse(ev.data); setLive(j); }catch{} };
    return ()=> es.close();
  },[]);
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Ads Admin</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12}}>
          <div style={{fontWeight:800}}>Totals</div>
          <pre style={{fontSize:12,whiteSpace:"pre-wrap"}}>{JSON.stringify(rep?.totals,null,2)}</pre>
        </div>
        <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12}}>
          <div style={{fontWeight:800}}>A/B Breakdown</div>
          <pre style={{fontSize:12,whiteSpace:"pre-wrap"}}>{JSON.stringify(ab?.ab,null,2)}</pre>
        </div>
        <div style={{gridColumn:"1 / span 2", background:"#111214", border:"1px solid #26272b", borderRadius:12, padding:12}}>
          <div style={{fontWeight:800}}>Live (SSE every 2s)</div>
          <pre style={{fontSize:12,whiteSpace:"pre-wrap"}}>{JSON.stringify(live,null,2)}</pre>
        </div>
        <div style={{gridColumn:"1 / span 2", background:"#111214", border:"1px solid #26272b", borderRadius:12, padding:12}}>
          <div style={{fontWeight:800}}>Last Impressions</div>
          <pre style={{fontSize:12,whiteSpace:"pre-wrap"}}>{JSON.stringify(rep?.impressions,null,2)}</pre>
        </div>
      </div>
    </main>
  );
}
