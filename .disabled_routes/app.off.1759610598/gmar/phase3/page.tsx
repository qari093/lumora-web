"use client";
import Link from "next/link";
import { GAMES_PHASE3 } from "../../../src/lib/gmar/games-phase3";
export default function Page(){
  return (
    <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <h1 style={{fontWeight:800,fontSize:20,marginBottom:12}}>GMAR — Phase 3 (AA+)</h1>
      <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))"}}>
        {GAMES_PHASE3.map(g=>(
          <Link key={g.id} href={`/gmar/phase3/${g.id}`} style={{border:"1px solid #1f2937",borderRadius:10,padding:"10px 12px",background:"#0b1220",display:"block"}}>
            <div style={{fontWeight:700}}>{g.title}</div>
            <div style={{opacity:.7,fontSize:12}}>{g.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
