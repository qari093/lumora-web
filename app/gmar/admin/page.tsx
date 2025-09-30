"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";

async function api(path:string, opt:any={}){
  const headers = { ...(opt.headers||{}), "x-admin-token": token || "" };
  const r = await fetch(path, { ...opt, headers });
  return r.json();
}

export default function Admin(){
  const [seasons,setSeasons]=useState<any[]>([]);
  const [fraud,setFraud]=useState<any>({});
  const [name,setName]=useState("Season "+new Date().getFullYear());
  const [days,setDays]=useState(90);

  useEffect(()=>{ load(); },[]);
  async function load(){
    const s = await api("/api/gmar/admin/season");
    setSeasons(s?.items||[]);
    const f = await api("/api/gmar/fraud/score");
    setFraud(f||{});
  }
  async function createSeason(){
    const start=new Date();
    const end=new Date(Date.now()+days*24*3600*1000);
    await api("/api/gmar/admin/season",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,startAt:start,endAt:end})});
    load();
  }
  async function activate(id:number){
    await api("/api/gmar/admin/season",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({activateId:id})});
    load();
  }
  async function ban(deviceId:string){
    const reason=prompt("Reason?","fraud")||"fraud";
    await api("/api/gmar/admin/ban",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId,reason})});
    load();
  }

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"#e5e7eb",fontFamily:"ui-sans-serif,system-ui"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid #27272a"}}>
        <Link href="/gmar" style={{color:"#a78bfa"}}>↩ Gmar</Link>
        <div style={{fontWeight:900}}>GMAR Admin</div>
      </div>

      <section style={{maxWidth:900,margin:"0 auto",padding:16}}>
        <div style={{background:"#18181b",border:"1px solid #27272a",padding:16,borderRadius:12,marginBottom:16}}>
          <div style={{fontWeight:800,marginBottom:8}}>Seasons</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Season name" style={{padding:"6px 8px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#fff"}}/>
            <input type="number" value={days} onChange={e=>setDays(parseInt(e.target.value||"90"))} style={{padding:"6px 8px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#fff",width:120}}/>
            <button onClick={createSeason} style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>Create (+{days} days)</button>
          </div>
          {(seasons||[]).map((s:any)=>(
            <div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid #27272a"}}>
              <div>#{s.id} — <b>{s.name}</b> {s.active?"• ACTIVE":""} <span style={{opacity:.7}}>({new Date(s.startAt).toLocaleDateString()} → {new Date(s.endAt).toLocaleDateString()})</span></div>
              <div>
                {!s.active && <button onClick={()=>activate(s.id)} style={{background:"#22c55e",color:"#000",padding:"6px 10px",borderRadius:8}}>Activate</button>}
                <a href="#" style={{marginLeft:8,color:"#a78bfa"}}>Export CSV</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:"#18181b",border:"1px solid #27272a",padding:16,borderRadius:12}}>
          <div style={{fontWeight:800,marginBottom:8}}>Fraud Signals (10 min)</div>
          <div style={{marginBottom:10}}>
            <div style={{fontWeight:700}}>High frequency</div>
            {(fraud?.freq||[]).map((r:any)=>(
              <div key={r.deviceId} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid #27272a"}}>
                <div>{r.deviceId}</div>
                <div>scores: {r.count}</div>
                <button onClick={()=>ban(r.deviceId)} style={{background:"#ef4444",color:"#fff",padding:"6px 10px",borderRadius:8}}>Ban</button>
              </div>
            ))}
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontWeight:700}}>Extreme scores (top 50)</div>
            <div style={{opacity:.7,fontSize:12,marginBottom:6}}>Check manually; legit top players can appear here.</div>
            {(fraud?.high||[]).map((r:any,i:number)=>(
              <div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid #27272a"}}>
                <div>#{i+1} {r.player}</div>
                <div>device:{r.deviceId} • value:{r.value}</div>
                <button onClick={()=>ban(r.deviceId)} style={{background:"#ef4444",color:"#fff",padding:"6px 10px",borderRadius:8}}>Ban</button>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontWeight:700}}>Shared IP (>3 devices)</div>
            {(fraud?.sharedIp||[]).map((r:any)=>(
              <div key={r.ip} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid #27272a"}}>
                <div>{r.ip}</div>
                <div>devices: {r.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
