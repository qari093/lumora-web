"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function AdsSlot(){
  const { placement } = useParams<{placement:string}>();
  const [ad,setAd]=React.useState<any>(null);
  const [imp,setImp]=React.useState("");
  const [variant,setVariant]=React.useState("");

  async function load(){
    const r=await fetch(`/api/ads/request?placement=${placement}&lang=en`);
    const j=await r.json();
    if(j?.ok){ setAd(j.ad); setImp(j.impressionId); setVariant(j.variant||""); }
    else { setAd(null); setImp(""); setVariant(""); }
  }
  React.useEffect(()=>{ load(); },[placement]);

  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Placement: {placement}</h1>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={load} style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>Reload</button>
      </div>
      {ad ? (
        <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12,maxWidth:520}}>
          <div style={{fontWeight:800,fontSize:18}}>{ad.title} {variant && <span style={{opacity:.7,fontSize:12}}>• var {variant}</span>}</div>
          <div style={{opacity:.8,fontSize:12}}>{ad.line}</div>
          <img src={ad.image} alt="ad" style={{width:"100%",borderRadius:8,marginTop:8}}/>
          <div style={{marginTop:8,display:"flex",justifyContent:"space-between"}}>
            <div style={{opacity:.7,fontSize:12}}>imp: {imp}</div>
            <a href={ad.url} target="_blank" style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}} rel="noreferrer">{ad.cta}</a>
          </div>
        </div>
      ) : <div style={{opacity:.8}}>No fill.</div>}
    </main>
  );
}
