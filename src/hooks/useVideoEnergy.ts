"use client";
import React from "react";

export function useVideoEnergy(videoId: string | undefined){
  const id = videoId || "";
  const [energy, setEnergy] = React.useState(0);
  const [breathPulse, setBreathPulse] = React.useState(0); // 0..1 on recent increments

  const refresh = React.useCallback(async ()=>{
    if(!id) return;
    try{
      const r = await fetch(`/api/energy/video?id=${encodeURIComponent(id)}`, { cache:"no-store" });
      const j = await r.json();
      if(j?.ok) setEnergy(j.stat.energy || 0);
    }catch{}
  }, [id]);

  const bump = React.useCallback(async (add:number)=>{
    if(!id || add<=0) return;
    try{
      setBreathPulse(1); // visual kick
      setTimeout(()=>setBreathPulse(0), 800);
      const r = await fetch("/api/energy/video", {
        method:"POST", headers:{ "content-type":"application/json" },
        body: JSON.stringify({ videoId: id, add })
      });
      const j = await r.json();
      if(j?.ok) setEnergy(j.stat.energy || 0);
    }catch{}
  }, [id]);

  React.useEffect(()=>{ refresh(); }, [refresh]);
  React.useEffect(()=>{
    if(!id) return;
    const t = setInterval(()=>refresh(), 4000);
    return ()=>clearInterval(t);
  }, [id, refresh]);

  return { energy, bump, breathPulse };
}
