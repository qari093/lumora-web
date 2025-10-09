"use client";
import React from "react";

export default function RewardedWallet({ onReward }:{ onReward?:(n:number)=>void }){
  const [imp,setImp]=React.useState("");
  const [open,setOpen]=React.useState(false);
  const [count,setCount]=React.useState(0);
  const [ad,setAd]=React.useState<any>(null);

  async function start(){
    try{
      const r = await fetch(`/api/ads/request?placement=rewarded_wallet&lang=en`);
      const j = await r.json();
      if(j?.ok){ setAd(j.ad); setImp(j.impressionId||""); setOpen(true); setCount(5); }
    }catch{}
  }

  React.useEffect(()=>{
    if(!open) return;
    const id = setInterval(()=> setCount(c=>{
      if(c<=1){ clearInterval(id); finish(); return 0; }
      return c-1;
    }), 1000);
    return ()=>clearInterval(id);
  },[open]);

  async function finish(){
    if(imp){
      try{
        await fetch("/api/ads/track",{ method:"POST", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ impressionId: imp, event: "reward" }) });
      }catch{}
    }
    setOpen(false);
    onReward?.(1);
    alert("+1 Zen earned");
  }

  return (
    <div>
      <button onClick={start} style={{background:"#22c55e",color:"#fff",padding:"8px 12px",borderRadius:8}}>Watch ad (+1 Zen)</button>
      {open && (
        <div style={{position:"fixed",inset:0,display:"grid",placeItems:"center",background:"rgba(0,0,0,.6)"}}>
          <div style={{background:"#0b0f14",border:"1px solid #243244",borderRadius:12,padding:16,width:360}}>
            <div style={{fontWeight:800}}>Rewarded Ad</div>
            <div style={{opacity:.8,margin:"8px 0"}}>{ad?.title || "Loading"}</div>
            <div>Watching… {count}s</div>
          </div>
        </div>
      )}
    </div>
  );
}
