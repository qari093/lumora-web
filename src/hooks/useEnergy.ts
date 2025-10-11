"use client";
import React from "react";

type Me = { energy:number; streakDays:number; lastActiveISO:string };
type Pool = { energy:number; updatedAt:number };
type Crew = { id:string; name:string; energy:number; members:number; updatedAt:number } | null;

export function useEnergy(){
  const [me, setMe] = React.useState<Me | null>(null);
  const [pool, setPool] = React.useState<Pool | null>(null);
  const [crew, setCrew] = React.useState<Crew>(null);
  const [flash, setFlash] = React.useState<string | null>(null);

  const refreshMe = React.useCallback(async ()=>{
    try{ const r = await fetch("/api/energy/me", { cache:"no-store" });
         const j = await r.json(); if(j?.ok) setMe(j.me); }catch{}
  },[]);
  const refreshPool = React.useCallback(async ()=>{
    try{ const r = await fetch("/api/energy/pool", { cache:"no-store" });
         const j = await r.json(); if(j?.ok) setPool(j.pool); }catch{}
  },[]);
  const refreshCrew = React.useCallback(async ()=>{
    try{ const r = await fetch("/api/crew/me", { cache:"no-store" });
         const j = await r.json(); if(j?.ok) setCrew(j.crew ?? null); }catch{}
  },[]);

  const earn = React.useCallback(async (type:"WATCH"|"LIKE"|"COMMENT"|"SHARE")=>{
    try{
      const r = await fetch("/api/energy/earn", {
        method:"POST", headers:{ "content-type":"application/json" },
        body: JSON.stringify({ type })
      });
      const j = await r.json();
      if(j?.ok){
        setMe(j.me); setPool({ energy: j.pool.energy, updatedAt: Date.now() });
        if(j.crew){ setCrew(j.crew); }
        const msg = type==="WATCH" ? "+Energy (watch)" :
                    type==="SHARE" ? "+Energy (share boost)" :
                    type==="LIKE"  ? "+Energy (like)" : "+Energy (comment)";
        setFlash(msg); setTimeout(()=>setFlash(null), 1000);
      }
    }catch{}
  },[]);

  const joinDemo = React.useCallback(async ()=>{
    try{
      const r = await fetch("/api/crew/join/demo", { method:"POST" });
      const j = await r.json(); if(j?.ok){ setCrew(j.crew); }
    }catch{}
  },[]);
  const leaveCrew = React.useCallback(async ()=>{
    try{ await fetch("/api/crew/leave", { method:"POST" }); setCrew(null); }catch{}
  },[]);

  // bootstrap
  React.useEffect(()=>{ refreshMe(); refreshPool(); refreshCrew(); }, [refreshMe, refreshPool, refreshCrew]);

  // light global pool polling
  React.useEffect(()=>{ const id = setInterval(()=>refreshPool(), 4000); return ()=>clearInterval(id); }, [refreshPool]);

  // Crew SSE stream
  React.useEffect(()=>{
    if(!crew) return;
    const es = new EventSource("/api/crew/stream");
    es.onmessage = (ev)=>{
      try{
        const j = JSON.parse(ev.data);
        if(j?.crew){ setCrew(j.crew); }
      }catch{}
    };
    return ()=>es.close();
  }, [crew?.id]);

  return { me, pool, crew, earn, flash, joinDemo, leaveCrew };
}
