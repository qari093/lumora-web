"use client";
import React from "react";

type Ad = { id:string; title:string; line:string; image?:string; cta?:string; url?:string; };
export default function InFeedAd(){
  const [ad, setAd] = React.useState<Ad|null>(null);
  const [imp,setImp]=React.useState<string>("");

  React.useEffect(()=>{
    let alive = true;
    fetch(`/api/ads/request?placement=videos_infeed&lang=en`)
      .then(r=>r.json())
      .then(j=>{ if(alive && j?.ok){ setAd(j.ad); setImp(j.impressionId||""); }})
      .catch(()=>{});
    return ()=>{ alive=false; };
  },[]);

  function track(ev:"click"|"skip"){
    if(!imp) return;
    fetch("/api/ads/track",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ impressionId:imp, event:ev })
    }).catch(()=>{});
  }

  if(!ad) return null;
  return (
    <div style={{border:"1px dashed #334", background:"#0b0f14", borderRadius:12, padding:12}}>
      <div style={{fontSize:12,opacity:.7,marginBottom:6}}>Sponsored</div>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        {ad.image && <img src={ad.image} width={96} height={96} style={{borderRadius:8,objectFit:"cover"}} alt="" />}
        <div style={{flex:1}}>
          <div style={{fontWeight:800}}>{ad.title}</div>
          <div style={{opacity:.8,fontSize:13}}>{ad.line}</div>
          {ad.url && (
            <a onClick={()=>track("click")} href={ad.url} target="_blank"
               style={{display:"inline-block",marginTop:8,background:"#4f46e5",color:"#fff",
               padding:"6px 10px",borderRadius:6}}> {ad.cta||"Open"} </a>
          )}
        </div>
        <button onClick={()=>track("skip")} style={{alignSelf:"start",background:"#222",color:"#fff",padding:"6px 10px",borderRadius:6}}>Skip</button>
      </div>
    </div>
  );
}
