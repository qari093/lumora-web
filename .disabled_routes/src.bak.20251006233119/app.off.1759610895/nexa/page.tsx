"use client";
import React from "react";

type Plan = { id:string; title:string; short:string; tags:string[] };
type Today = { ok:boolean; assigned:boolean; planId?:string; dayIndex?:number; streak?:number; tasks?: any };

async function api(path:string, init?:RequestInit){
  const r = await fetch(path, { ...init, headers: { "x-device-id":"dev1", "Content-Type":"application/json", ...(init?.headers||{}) } });
  return r.json();
}

export default function NexaDashboard(){
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [today, setToday] = React.useState<Today|null>(null);
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  React.useEffect(()=>{ (async()=>{
    const p = await api("/api/nexa/plans");
    setPlans(p.plans||[]);
    const t = await api("/api/nexa/plan/today");
    setToday(t);
  })(); },[]);

  async function start(planId:string){
    setLoading(true);
    const t = await api("/api/nexa/plan/start", { method:"POST", body: JSON.stringify({ planId }) });
    setToday(t);
    setMsg("پلان شروع ہو گیا ✅");
    setLoading(false);
  }

  async function complete(){
    setLoading(true);
    const res = await api("/api/nexa/plan/progress", { method:"POST", body: JSON.stringify({ done:true }) });
    const t = await api("/api/nexa/plan/today");
    setToday(t);
    setMsg("آج مکمل ✅");
    setLoading(false);
  }

  const card:React.CSSProperties = { border:"1px solid #222", borderRadius:12, padding:16, background:"#0b0f12", color:"#e5e7eb" };
  const btn=(active:boolean)=>({ padding:"10px 14px", borderRadius:10, border:"1px solid #333", background: active? "#16a34a":"#111827", color: active?"#0b0f12":"#e5e7eb", fontWeight:800, cursor:"pointer" });

  return (
    <div style={{ padding:20, color:"#e5e7eb" }}>
      <h1 style={{ marginBottom:12 }}>🌿 NEXA Wellness</h1>
      {msg && <div style={{ marginBottom:10, color:"#a7f3d0" }}>{msg}</div>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={card}>
          <h3>📅 آج کے ٹاسک</h3>
          {!today?.assigned && <p>ابھی کوئی پلان منتخب نہیں۔ نیچے سے منتخب کریں۔</p>}
          {today?.assigned && (
            <div>
              <p><b>پلان:</b> {today?.planId} &nbsp; • &nbsp; <b>دن:</b> {(today?.dayIndex||0)+1}</p>
              <p><b>فیز:</b> {today?.tasks?.phase}</p>
              <pre style={{ whiteSpace:"pre-wrap" }}>
{today?.tasks?.diet}
{"\n"}{today?.tasks?.workout}
{"\n"}{today?.tasks?.sleep}
{"\n"}{today?.tasks?.steps}
              </pre>
              <button onClick={complete} style={btn(true)} disabled={loading}>{loading?"..." :"آج مکمل کریں"}</button>
            </div>
          )}
        </div>

        <div style={card}>
          <h3>🧭 پلان منتخب کریں</h3>
          <div style={{ display:"grid", gap:8 }}>
            {plans.map(p=>(
              <div key={p.id} style={{ border:"1px solid #333", borderRadius:10, padding:10 }}>
                <div style={{ fontWeight:700 }}>{p.title}</div>
                <div style={{ opacity:.8 }}>{p.short}</div>
                <div style={{ margin:"6px 0", opacity:.7, fontSize:12 }}>Tags: {p.tags.join(", ")}</div>
                <button onClick={()=>start(p.id)} style={btn(false)} disabled={loading}>شروع کریں</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
