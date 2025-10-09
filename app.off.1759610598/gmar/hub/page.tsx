"use client";
import React from "react";
import Link from "next/link";
import { GAMES_HUB } from "../../../src/lib/hub/manifest";

export default function HubHome(){
  return (
    <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontWeight:800,fontSize:20}}>Lumora Engine Hub</div>
          <div style={{opacity:.7,fontSize:12}}>One SDK • Multiple Engines • Shared Zen Economy</div>
        </div>
        <Link href="/gmar" style={{color:"#93c5fd",textDecoration:"underline"}}>← Back</Link>
      </div>
      <div style={{display:"grid",gap:10,gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))"}}>
        {GAMES_HUB.map(g=>(
          <Link key={g.id} href={`/gmar/hub/${g.id}`} style={{border:"1px solid #1f2937",borderRadius:12,padding:"10px 12px",background:"#0b1220",display:"grid",gap:6}}>
            <div style={{fontWeight:700}}>{g.title}</div>
            <div style={{opacity:.75,fontSize:12}}>{g.desc}</div>
            <div style={{opacity:.6,fontSize:11}}>engine: {g.engine}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
