"use client";
import React, { useEffect, useMemo, useState } from "react";

type Ev = { id:string; gameId:string; type:string; variant?:string; at:number; meta?:any; device:string };

export default function Analytics(){
  const [rows,setRows]=useState<Ev[]>([]);
  useEffect(()=>{ (async ()=>{
    const r=await fetch("/api/gmar/events?limit=1000",{cache:"no-store"}); const j=await r.json(); setRows(j?.items||[]);
  })(); },[]);

  const ctr = useMemo(()=>{
    const by:any = { holo:{shown:0,open:0}, banner:{shown:0,open:0} };
    rows.forEach(e=>{
      if (e.type==="ad_shown") by[e.variant||"banner"].shown++;
      if (e.type==="ad_buy_open") by[e.variant||"banner"].open++;
    });
    return by;
  }, [rows]);

  function pct(a:number,b:number){ if(!b) return "0%"; return Math.round((a/b)*1000)/10+"%"; }

  return (
    <main style={{fontFamily:"ui-sans-serif,system-ui",color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh",padding:16}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <a href="/gmar" style={{color:"#8b5cf6"}}>← GMAR</a>
        <div style={{fontWeight:800}}>Ad Analytics</div>
        <div/>
      </header>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
        <div style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,padding:12}}>
          <div style={{fontWeight:700,marginBottom:6}}>Holographic</div>
          <div>Shown: {ctr.holo.shown}</div>
          <div>Opens: {ctr.holo.open}</div>
          <div>CTR: {pct(ctr.holo.open, ctr.holo.shown)}</div>
        </div>
        <div style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,padding:12}}>
          <div style={{fontWeight:700,marginBottom:6}}>Banner</div>
          <div>Shown: {ctr.banner.shown}</div>
          <div>Opens: {ctr.banner.open}</div>
          <div>CTR: {pct(ctr.banner.open, ctr.banner.shown)}</div>
        </div>
      </div>

      <div style={{marginTop:16,background:"#18181b",border:"1px solid #27272a",borderRadius:12}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#0f0f12"}}><th style={{textAlign:"left",padding:10}}>When</th><th>Game</th><th>Type</th><th>Variant</th></tr></thead>
          <tbody>
            {rows.slice(0,200).map((e,i)=>(
              <tr key={i} style={{borderTop:"1px solid #27272a"}}>
                <td style={{padding:10}}>{new Date(e.at).toLocaleString()}</td>
                <td>{e.gameId}</td><td>{e.type}</td><td>{e.variant||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
