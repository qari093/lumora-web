"use client";
import React from "react";

export function useActionToken(){
  const [token, setToken] = React.useState<string | null>(null);
  const refresh = React.useCallback(async ()=>{
    try{
      const r = await fetch("/api/energy/issue", { cache:"no-store" });
      const j = await r.json(); if(j?.ok) setToken(j.token || null);
    }catch{}
  },[]);
  React.useEffect(()=>{ refresh(); const id=setInterval(refresh, 50_000); return ()=>clearInterval(id); }, [refresh]);
  return token;
}
