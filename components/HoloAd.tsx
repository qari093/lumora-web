"use client";
import React, { useEffect, useState } from "react";

export default function HoloAd({ niche, onBuy }:{ niche?:string; onBuy:(ad:any)=>void }){
  const [ad,setAd] = useState<any|null>(null);
  const [show,setShow] = useState<boolean>(true);

  useEffect(()=>{
    let active = true;
    (async()=>{
      try{
        const r = await fetch(`/api/holo/ads?niche=${encodeURIComponent(niche||"")}`, { cache:"no-store" });
        const j = await r.json(); 
        if (active && j?.items?.[0]) {
          setAd(j.items[0]);
          setShow(true);
          setTimeout(()=>setShow(false), 3500);
        }
      }catch{}
    })();
    return ()=>{ active=false; };
  }, [niche]);

  if (!ad || !show) return null;

  return (
    <div className="holo-ad" style={{
      position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,0.35)", pointerEvents:"auto"
    }}>
      <div style={{ background:"rgba(24,24,27,0.95)", border:"1px solid #3f3f46", borderRadius:14, padding:"12px 14px", width:320, textAlign:"center" }}>
        <div style={{fontWeight:800, marginBottom:6}}>{ad.title}</div>
        <img src={ad.img} alt="ad" style={{width:120, height:120, objectFit:"cover", borderRadius:12, margin:"6px auto"}}/>
        <div style={{opacity:.8, fontSize:13, marginBottom:10}}>{ad.desc}</div>
        <button onClick={()=> onBuy(ad)} style={{background:"#4f46e5", color:"#fff", borderRadius:8, padding:"8px 12px"}}>
          Click to buy – {ad.price}
        </button>
      </div>
    </div>
  );
}
