"use client";
import React from "react";
type Row={emotion:string;count:number;avg:number};

function colorFor(v:number){
  const t=Math.max(0,Math.min(1,v));
  const r=Math.round(255*Math.max(0,Math.min(1,2*t)));
  const g=Math.round(255*Math.max(0,Math.min(1,2*(1-Math.abs(t-0.5)))));
  const b=Math.round(255*Math.max(0,Math.min(1,2*(1-t))));
  return `rgb(${r},${g},${b})`;
}

export default function EmmlHeat(){
  const [rows,setRows]=React.useState<Row[]|null>(null);
  const [err,setErr]=React.useState<string|null>(null);
  const [busy,setBusy]=React.useState(false);

  const load=React.useCallback(()=>{ 
    fetch("/api/emotion/heat").then(r=>r.json()).then(j=>{
      setRows(Array.isArray(j?.data)? j.data : []); setErr(null);
    }).catch(e=>setErr(String(e?.message||e)));
  },[]);

  React.useEffect(()=>{ load(); const id=setInterval(load,5000); return ()=>clearInterval(id); },[load]);

  async function addDemo(){ try{ setBusy(true); await fetch("/api/emotion/demo-add",{method:"POST"}); load(); } finally{ setBusy(false); } }

  return (
    <main style={{minHeight:"100vh",padding:"24px",display:"flex",flexDirection:"column",gap:16 as any}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <h1 style={{fontSize:28,fontWeight:800,margin:0}}>EMML — Emotion Heatmap</h1>
        <button onClick={addDemo} disabled={busy} style={{
          padding:"10px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.15)",
          background: busy? "rgba(255,255,255,0.15)":"rgba(255,255,255,0.08)", cursor: busy? "not-allowed":"pointer"
        }}>{busy? "Adding…":"Add demo event"}</button>
      </div>

      {err && <div style={{color:"#e33"}}>Error: {err}</div>}
      {rows===null && <div>Loading…</div>}
      {rows && rows.length===0 && (
        <div style={{opacity:.8}}>No data yet. Use “Add demo event” or trigger ingest; the view auto-refreshes every 5s.</div>
      )}

      {rows && rows.length>0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {rows.map(r=>{
            const bg=colorFor((r.avg??0));
            return (
              <div key={r.emotion} style={{
                padding:"14px 16px", borderRadius:14,
                background: `linear-gradient(180deg,${bg}22,${bg}10)`,
                boxShadow:"0 0 0 1px rgba(255,255,255,.08) inset, 0 6px 18px rgba(0,0,0,.25)"
              }}>
                <div style={{fontSize:12,opacity:.7,marginBottom:6}}>Emotion</div>
                <div style={{fontSize:20,fontWeight:800,marginBottom:10}}>{r.emotion}</div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:4}}>
                  <span>Count</span><strong>{r.count}</strong>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span>Avg Intensity</span><strong>{(r.avg??0).toFixed(2)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
