"use client";
import React, { useEffect, useState } from "react";
export default function ZenBalanceBadge(){
  const [bal,setBal]=useState<number>(0);
  const [active,setActive]=useState(false);
  useEffect(()=>{ const w=window as any; if(w.__ZEN_BADGE__) return; w.__ZEN_BADGE__=true; setActive(true); return ()=>{ w.__ZEN_BADGE__=false; }; },[]);
  async function load(){ try{ const r=await fetch("/api/zen/ledger",{headers:{ "x-device-id":"dev1" }, cache:"no-store"}); const j=await r.json(); if(j?.balance!=null) setBal(j.balance); }catch{} }
  useEffect(()=>{ if(active){ load(); const t=setInterval(load,4000); return ()=>clearInterval(t); } },[active]);
  if(!active) return null;
  return <div style={{position:"fixed",top:12,right:12,background:"#111214",border:"1px solid #26272b",padding:"6px 12px",borderRadius:8,fontSize:13,zIndex:9999}}>💰 {bal} ZC</div>;
}
