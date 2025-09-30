"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePulsePlayer } from "../_player/PlayerDock";
type Track = { id:string; title:string; artist?:string; url:string; genre?:string; energy?:string; bpm?:number; source?:string };
export default function Explore(){
  const [q,setQ]=useState(""); const [all,setAll]=useState<Track[]>([]);
  const [cats,setCats]=useState<{id:string;name:string}[]>([]); const [active,setActive]=useState<string>("all");
  const { playNow, enqueue } = usePulsePlayer();
  useEffect(()=>{ (async()=>{
    const m = await (await fetch("/api/music/manifest",{cache:"no-store"})).json(); setAll(m.catalog||[]);
    const c = await (await fetch("/categories",{cache:"no-store"})).json(); setCats(c.categories||[]);
  })(); },[]);
  const items = useMemo(()=>{
    const s=q.trim().toLowerCase();
    return (all||[])
      .filter(t => active==="all" ? true : (t.genre===active))
      .filter(t => !s ? true :
        [t.title,t.artist,t.genre,t.energy,String(t.bpm??"")].filter(Boolean).join(" ").toLowerCase().includes(s)
      );
  },[q,all,active]);
  return (
    <section>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Explore</h1>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        {cats.map(c=>(
          <button key={c.id} onClick={()=>setActive(c.id)}
            style={{background: active===c.id ? "#4f46e5" : "#18181b", color:"#fff", border:"1px solid #27272a", borderRadius:999, padding:"6px 10px", fontSize:13}}>
            {c.name}
          </button>
        ))}
      </div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title, artist, genre…"
             style={{width:"100%",padding:"12px 14px",borderRadius:10,background:"#0a0a0a",border:"1px solid #27272a",color:"#e5e7eb"}} />
      <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",marginTop:16}}>
        {items.map((t)=>(
          <div key={t.id} style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,padding:14,display:"grid",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <div style={{fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={t.title}>{t.title}</div>
              {t.source && <span style={{fontSize:10,background:"#0f172a",border:"1px solid #1f2937",padding:"2px 6px",borderRadius:6,opacity:.85}}>{t.source}</span>}
            </div>
            <div style={{opacity:.8,fontSize:13,whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden"}}>
              {(t.artist||"Unknown")}{t.genre?(" • "+t.genre):""}{t.energy?(" • "+t.energy):""}
            </div>
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <button onClick={()=>playNow(t)} style={{background:"#4f46e5",color:"#fff",borderRadius:8,padding:"8px 10px"}}>Play</button>
              <button onClick={()=>enqueue(t)} style={{background:"#3f3f46",color:"#fff",borderRadius:8,padding:"8px 10px"}}>Queue</button>
            </div>
          </div>
        ))}
      </div>
      {items.length===0 && <div style={{opacity:.7,marginTop:12}}>No results. Try another query.</div>}
    </section>
  );
}
