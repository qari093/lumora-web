"use client";

import React, { useEffect, useState, useTransition } from "react";

type Item = { id:string; slug:string; title:string|null; status:string; startAt:string|null; createdAt:string|null; };
type ListResp = { ok:boolean; items: Item[] };

export default function CelebrationsIndex() {
  async function createNew(){
    try{
      const stamp = new Date().toISOString().replace(/[:T]/g,"-").slice(0,19);
      const res = await fetch("/api/celebrations/create",{ method:"POST", headers:{ "content-type":"application/json" },
        body: JSON.stringify({ title: "Celebration " + stamp }) });
      const j = await res.json();
      if(!j.ok) throw new Error(j.error||"create failed");
      window.location.href = "/celebrations/" + j.celebration.slug;
    }catch(e:any){ alert("Create failed: " + (e?.message||e)); }
  }
  const [items,setItems] = useState<Item[]|null>(null);
  const [err,setErr] = useState<string|null>(null);
  const [pending, startTransition] = useTransition();

  async function load(){
    try{
      setErr(null);
      const r = await fetch("/api/celebrations/list", { cache:"no-store" });
      if(!r.ok) throw new Error("HTTP " + r.status);
      const j = (await r.json()) as ListResp;
      setItems(j.items || []);
    }catch(e:any){
      setErr(String(e?.message||e));
      setItems(null);
    }
  }

  useEffect(()=>{ load(); },[]);

  return (
    <main style={{ fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial", color:"#fff", background:"#0a0b10", minHeight:"100vh", padding:20 }}>
      <div style={{ maxWidth: 860, margin:"40px auto 120px auto" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <h1 style={{ fontSize:28, fontWeight:900, margin:0 }}>Celebrations</h1>
          <button onClick={()=>startTransition(load)} disabled={pending} style={btn()}>{pending?"Refreshing…":"Refresh"}</button>
          <button onClick={createNew} style={btn()}>New</button>
        </div>

        {err && (
          <div style={{ ...card(), marginTop:16, borderColor:"#f55" }}>
            <div style={h()}>Error</div>
            <div style={{ opacity:.85 }}>{err}</div>
          </div>
        )}

        {!items && !err && <div style={{ marginTop:16, opacity:.8 }}>Loading…</div>}

        {items && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16 }}>
            {items.map(row=>(
              <a key={row.id} href={"/celebrations/"+row.slug} style={{ ...card(), textDecoration:"none", color:"inherit" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <div style={h()}>{row.title || row.slug}</div>
                  <code style={{ opacity:.8, fontSize:12 }}>{row.status}</code>
                </div>
                <div style={{ opacity:.85, fontSize:13, marginTop:6 }}>
                  Created: {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                </div>
                <div style={{ opacity:.85, fontSize:13 }}>
                  Start: {row.startAt ? new Date(row.startAt).toLocaleString() : "—"}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function btn(){ return { padding:"8px 12px", borderRadius:10, border:"1px solid #667", background:"transparent", cursor:"pointer", fontWeight:700 } as const; }
function card(){ return { border:"1px solid rgba(120,120,140,.35)", borderRadius:12, padding:14, background:"rgba(18,18,26,.55)", backdropFilter:"blur(6px)" } as const; }
function h(){ return { fontWeight:800, marginBottom:8, opacity:.9 } as const; }
