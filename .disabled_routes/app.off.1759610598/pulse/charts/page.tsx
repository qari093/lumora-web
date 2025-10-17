"use client";
import React,{useEffect,useState} from "react";
type R={ id:string; title:string; artist?:string; url:string; plays:number };

export default function Charts(){
  const [window,setWindow]=useState<"hour"|"day"|"week">("hour");
  const [lang,setLang]=useState(""); const [niche,setNiche]=useState("");
  const [items,setItems]=useState<R[]>([]); const [since,setSince]=useState<string>(""); const [loading,setLoading]=useState(false);

  async function load(){
    setLoading(true);
    const u=new URL("/api/charts", location.origin);
    u.searchParams.set("window", window);
    if(lang) u.searchParams.set("lang", lang);
    if(niche) u.searchParams.set("niche", niche);
    const r=await fetch(u); const j=await r.json();
    setItems(j.ranking||[]); setSince(j.since||""); setLoading(false);
  }
  useEffect(()=>{ load(); },[window]);

  return (
    <main style={{maxWidth:1000,margin:"0 auto",padding:"16px"}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Charts</h1>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <select value={window} onChange={e=>setWindow(e.target.value as any)} style={inp}>
          <option value="hour">Last Hour</option>
          <option value="day">Last 24h</option>
          <option value="week">Last 7 days</option>
        </select>
        <input value={lang} onChange={e=>setLang(e.target.value)} placeholder="lang (de, en,…)" style={inp}/>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="niche (workout, focus…)" style={inp}/>
        <button onClick={load} disabled={loading} style={btn}>{loading?"Loading…":"Refresh"}</button>
        {since && <div style={{opacity:.7,alignSelf:"center"}}>Since {new Date(since).toLocaleString()}</div>}
      </div>
      {!items.length ? <div style={{opacity:.7}}>No data yet.</div> :
      <div style={{display:"grid",gap:10}}>
        {items.map((t,i)=>(
          <div key={t.id} style={card}>
            <div style={{fontWeight:700}}># {i+1} — {t.title} <span style={{opacity:.7,fontWeight:400}}>• {t.plays} plays</span></div>
            <div style={{opacity:.75,fontSize:13}}>{t.artist||"Unknown"}</div>
            <audio src={t.url} preload="none" controls style={{width:"100%",marginTop:8}}/>
          </div>
        ))}
      </div>}
    </main>
  );
}
const inp:React.CSSProperties={padding:"8px 10px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#e5e7eb"};
const btn:React.CSSProperties={background:"#4f46e5",color:"#fff",padding:"8px 12px",borderRadius:8};
const card:React.CSSProperties={background:"#18181b",border:"1px solid #27272a",borderRadius:10,padding:12};
