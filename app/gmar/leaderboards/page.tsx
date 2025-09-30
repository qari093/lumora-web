"use client";
import React, { useEffect, useState } from "react";

const GAMES = [
  { id:"runner_1", name:"Runner One" },
  { id:"grid_tactics", name:"Grid Tactics" },
  { id:"skyline_builder", name:"Skyline Builder" },
  { id:"neon_arena", name:"Neon Arena" },
  { id:"warp_rally", name:"Warp Rally" }
  // extend
];

export default function Leaderboards(){
  const [tab,setTab]=useState("runner_1");
  const [rows,setRows]=useState<{player:string;score:number;device:string;at:number}[]>([]);

  async function load(g:string){
    const r=await fetch("/api/gmar/score?gameId="+encodeURIComponent(g),{cache:"no-store"});
    const j=await r.json(); setRows(j?.items||[]);
  }
  useEffect(()=>{ load(tab); },[tab]);

  return (
    <main style={{fontFamily:"ui-sans-serif,system-ui",color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh",padding:16}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <a href="/gmar" style={{color:"#8b5cf6"}}>← GMAR</a>
        <div style={{fontWeight:800}}>Leaderboards</div>
        <div/>
      </header>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        {GAMES.map(g=>(
          <button key={g.id} onClick={()=>setTab(g.id)}
                  style={{padding:"8px 12px",borderRadius:8,background: tab===g.id?"#4f46e5":"#3f3f46",color:"#fff"}}>{g.name}</button>
        ))}
      </div>

      <div style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#0f0f12"}}><th style={{textAlign:"left",padding:10}}>#</th><th style={{textAlign:"left"}}>Player</th><th style={{textAlign:"left"}}>Score</th><th style={{textAlign:"left"}}>When</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{borderTop:"1px solid #27272a"}}>
                <td style={{padding:10}}>{i+1}</td>
                <td>{r.player||"Anonymous"}</td>
                <td>{r.score}</td>
                <td>{new Date(r.at).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={4} style={{padding:12,opacity:.7}}>No scores yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
