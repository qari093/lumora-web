"use client";
import React from "react";
export default function IcePage(){
  const [servers,setServers]=React.useState<any[]>([]);
  React.useEffect(()=>{ (async()=>{
    const r=await fetch("/api/ice"); const j=await r.json(); setServers(j.iceServers||[]);
  })(); },[]);
  return <div style={{padding:20}}>
    <h1>ICE Servers</h1>
    <pre style={{background:"#0b0f12",color:"#e5e7eb",padding:12,borderRadius:8}}>{JSON.stringify(servers,null,2)}</pre>
    <div style={{marginTop:8,opacity:.8}}>Env <code>TURN_PROVIDER=public|static|twilio</code></div>
  </div>;
}
