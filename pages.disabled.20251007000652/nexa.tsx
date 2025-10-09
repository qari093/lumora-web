import { useEffect, useRef, useState } from "react";

type Plan = { id:string; title:string; short:string; tags:string[] };
type TodayRes = { ok:boolean; assigned:boolean; planId?:string; dayIndex?:number; streak?:number; tasks?: any; xp?:number; level?:number; waterMl?:number; waterGoalMl?:number; badges?:string[] };

async function api(path:string, init?:RequestInit){
  const r = await fetch(path, { ...init, headers: { "x-device-id":"dev1", "Content-Type":"application/json", ...(init?.headers||{}) } });
  return r.json();
}
const card:React.CSSProperties={ border:"1px solid #222", borderRadius:12, padding:16, background:"#0b0f12", color:"#e5e7eb" };
const btn=(active:boolean)=>({ padding:"10px 14px", borderRadius:10, border:"1px solid #333", background: active? "#16a34a":"#111827", color: active?"#0b0f12":"#e5e7eb", fontWeight:800, cursor:"pointer" });

export default function Nexa(){
  const [plans,setPlans]=useState<Plan[]>([]);
  const [today,setToday]=useState<TodayRes|null>(null);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");
  const [badges,setBadges]=useState<string[]>([]);
  const breathTimer = useRef<NodeJS.Timeout|null>(null);
  const [breathLeft,setBreathLeft]=useState(0);

  async function refresh(){
    setPlans((await api("/api/nexa/plans")).plans||[]);
    const t = await api("/api/nexa/plan/today"); setToday(t);
    const b = await api("/api/nexa/badges"); setBadges(b.badges||[]);
  }

  useEffect(()=>{ refresh(); },[]);

  async function start(planId:string){
    setLoading(true);
    await api("/api/nexa/plan/start",{ method:"POST", body: JSON.stringify({ planId }) });
    await refresh(); setMsg("پلان شروع ہو گیا ✅"); setLoading(false);
  }
  async function complete(){
    setLoading(true);
    await api("/api/nexa/plan/progress",{ method:"POST", body: JSON.stringify({ done:true, metrics:{ mood:"calm" } }) });
    await refresh(); setMsg("آج مکمل ✅"); setLoading(false);
  }
  async function addWater(ml:number){
    await api("/api/nexa/hydrate",{ method:"POST", body: JSON.stringify({ ml }) });
    await refresh();
  }
  function startBreath(type:"box"|"478", seconds:number){
    if(breathTimer.current) clearInterval(breathTimer.current);
    setBreathLeft(seconds);
    breathTimer.current = setInterval(()=>{
      setBreathLeft((s)=>{
        if(s<=1){ clearInterval(breathTimer.current!); api("/api/nexa/breath",{ method:"POST", body: JSON.stringify({ type, seconds }) }).then(refresh); return 0; }
        return s-1;
      });
    },1000);
  }

  const pct = (today?.waterMl||0) / Math.max(1,(today?.waterGoalMl||2500));
  const pct100 = Math.min(100, Math.round(pct*100));

  return (
    <div style={{ padding:20, color:"#e5e7eb" }}>
      <h1>🌿 NEXA Wellness</h1>
      {msg && <div style={{ marginBottom:10, color:"#a7f3d0" }}>{msg}</div>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={card}>
          <h3>📅 آج کے ٹاسک</h3>
          {!today?.assigned && <p>ابھی کوئی پلان منتخب نہیں۔ نیچے سے منتخب کریں۔</p>}
          {today?.assigned && (
            <div>
              <p><b>پلان:</b> {today?.planId} • <b>دن:</b> {(today?.dayIndex||0)+1} • <b>Streak:</b> {today?.streak}</p>
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
          <h3>🎮 XP / Level</h3>
          <p><b>Level:</b> {today?.level||1} • <b>XP:</b> {today?.xp||0}</p>
          <div style={{ height:10, background:"#111827", borderRadius:8, overflow:"hidden", border:"1px solid #333" }}>
            <div style={{ width:, height:"100%", background:"#16a34a" }} />
          </div>
          <div style={{ marginTop:8 }}>
            <button onClick={()=>api("/api/nexa/xp",{ method:"POST", body: JSON.stringify({ delta:5, reason:"test" }) }).then(refresh)} style={btn(false)}>+5 XP</button>
          </div>
        </div>

        <div style={card}>
          <h3>💧 Hydration</h3>
          <p>{today?.waterMl||0} / {today?.waterGoalMl||2500} ml ({pct100}%)</p>
          <div style={{ height:10, background:"#111827", borderRadius:8, overflow:"hidden", border:"1px solid #333" }}>
            <div style={{ width:, height:"100%", background:"#3b82f6" }} />
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button style={btn(false)} onClick={()=>addWater(250)}>+250 ml</button>
            <button style={btn(false)} onClick={()=>addWater(500)}>+500 ml</button>
            <button style={btn(false)} onClick={()=>addWater(750)}>+750 ml</button>
          </div>
        </div>

        <div style={card}>
          <h3>🌬️ Breathing</h3>
          <p>ٹائمر: {breathLeft}s</p>
          <div style={{ display:"flex", gap:8 }}>
            <button style={btn(false)} onClick={()=>startBreath("box", 60)}>Box (60s)</button>
            <button style={btn(false)} onClick={()=>startBreath("478", 60)}>4-7-8 (60s)</button>
          </div>
        </div>

        <div style={card}>
          <h3>🏅 Badges</h3>
          {(!badges||badges.length===0) ? <p>ابھی کوئی بیج نہیں۔</p> :
            <ul>{badges.map(b=><li key={b}>{b}</li>)}</ul>}
        </div>

        <div style={card}>
          <h3>🗓️ Weekly Reflection</h3>
          <p>ہفتہ وار مختصر جائزہ—خلاصہ اور مشورہ حاصل کریں۔</p>
          <button style={btn(false)} onClick={()=>api("/api/nexa/weekly",{ method:"POST" }).then(async r=>{ await refresh(); setMsg("ہفتہ وار ریفلیکشن مکمل ✅"); })}>Reflect Now</button>
          <p style={{ marginTop:8 }}><a href="/nexa/live" style={{ color:"#93c5fd", textDecoration:"underline" }}>Live Feed (SSE)</a></p>
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
