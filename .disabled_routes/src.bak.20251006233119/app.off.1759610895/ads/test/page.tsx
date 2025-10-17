"use client";
import React from "react";

export default function AdsTestPage(){
  const [ad,setAd]=React.useState<any>(null);
  const [impressionId,setImp]=React.useState<string>("");
  const [variant,setVariant]=React.useState<string>("");

  async function req(){
    const u=`/api/ads/request?placement=videos_infeed&lang=en`;
    const r=await fetch(u); const j=await r.json();
    if(j?.ok){ setAd(j.ad); setImp(j.impressionId); setVariant(j.variant||""); }
    else { alert("No fill"); setAd(null); setImp(""); setVariant(""); }
  }
  async function track(event:"click"|"skip"|"reward"|"hold"){
    if(!impressionId){ alert("no impression"); return;}
    const r=await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId,event})});
    const j=await r.json();
    alert("Track result: "+JSON.stringify(j));
  }
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Ads Test</h1>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={req} style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>Request</button>
        <button onClick={()=>track("click")} style={{background:"#10b981",color:"#fff",padding:"6px 10px",borderRadius:8}}>Click</button>
        <button onClick={()=>track("skip")} style={{background:"#f59e0b",color:"#fff",padding:"6px 10px",borderRadius:8}}>Skip</button>
        <button onClick={()=>track("reward")} style={{background:"#22c55e",color:"#fff",padding:"6px 10px",borderRadius:8}}>Reward</button>
      </div>
      {ad ? (
        <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12,maxWidth:520}}>
          <div style={{fontWeight:800,fontSize:18}}>{ad.title} {variant && <span style={{opacity:.7,fontSize:12}}>• var {variant}</span>}</div>
          <div style={{opacity:.8,fontSize:12}}>{ad.line}</div>
          <div style={{marginTop:8}}>
            <img src={ad.image} alt="ad" style={{width:"100%",borderRadius:8}}/>
          </div>
          <div style={{marginTop:8,display:"flex",justifyContent:"space-between"}}>
            <div style={{opacity:.7,fontSize:12}}>imp: {impressionId}</div>
            <a href={ad.url} target="_blank" style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}} rel="noreferrer">{ad.cta}</a>
          </div>
        </div>
      ) : <div style={{opacity:.8}}>No ad loaded.</div>}
    </main>
  );
}
