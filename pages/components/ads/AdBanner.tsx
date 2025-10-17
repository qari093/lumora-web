import React from "react";

type Ad = {
  adId: string;
  campaignId?: string;
  headline: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  lumaCardUrl: string;
};

export default function AdBanner(){
  const [ad, setAd] = React.useState<Ad | null>(null);
  const sentRef = React.useRef(false);

  React.useEffect(() => {
    let stop = false;
    (async () => {
      try{
        const r = await fetch("/api/ad-server/next",{ cache:"no-store" });
        if(!r.ok) return;
        const j = await r.json();
        if(!stop) setAd(j?.ad || null);
      }catch{}
    })();
    return ()=>{ stop = true; };
  }, []);

  // fire view ping once when ad arrives
  React.useEffect(() => {
    if (!ad || sentRef.current) return;
    sentRef.current = true;
    fetch("/api/ad-server/view", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ adId: ad.adId, campaignId: ad.campaignId })
    }).catch(()=>{});
  }, [ad]);

  function onClick(){
    if (!ad) return;
    fetch("/api/ad-server/click", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ adId: ad.adId, campaignId: ad.campaignId })
    }).catch(()=>{});
  }

  if(!ad){
    return (
      <div style={{
        border:"1px solid #222", borderRadius:12, padding:12, background:"#0f1319",
        display:"flex", alignItems:"center", gap:12
      }}>
        <div style={{height:64, width:96, background:"#0a0c10", borderRadius:8}}/>
        <div>
          <div style={{height:16, width:220, background:"#141922", borderRadius:6, marginBottom:8}}/>
          <div style={{height:12, width:140, background:"#121720", borderRadius:6}}/>
        </div>
      </div>
    );
  }

  return (
    <a onClick={onClick} href={ad.lumaCardUrl} style={{
      display:"flex", gap:12, textDecoration:"none", color:"#e5e7eb",
      border:"1px solid #222", borderRadius:12, padding:12, background:"#0f1319"
    }}>
      <img src={ad.imageUrl} alt={ad.headline}
           style={{height:64, width:96, objectFit:"cover", borderRadius:8}} />
      <div style={{flex:1}}>
        <div style={{fontWeight:900}}>{ad.headline}</div>
        <div style={{opacity:.8, fontSize:13}}>{ad.description}</div>
        <div style={{
          marginTop:8, display:"inline-block", padding:"6px 10px",
          borderRadius:8, background:"linear-gradient(180deg,#22c55e,#16a34a)",
          color:"#0b0f12", fontWeight:900
        }}>{ad.ctaText}</div>
      </div>
    </a>
  );
}
