"use client";
import * as React from "react";

export default function HarmonyDemo(){
  const [stats, setStats] = React.useState<any>(null);
  const [balance, setBalance] = React.useState<number>(0);
  const [xp, setXp] = React.useState<number>(0);

  async function refresh(){
    try{
      const s = await fetch("/api/pulse/stats",{cache:"no-store"}).then(r=>r.json());
      setStats(s);
    }catch(e){ console.error(e); }
  }
  async function earnOnce(){
    const r = await fetch("/api/pulse/earn", {
      method:"POST",
      headers:{ "content-type":"application/json", "x-user-id":"demo-user", "x-days-since-signup":"3" },
      body: JSON.stringify({ baseAmount:1, note:"watch_ad" })
    });
    await r.json().catch(()=>null);
    setBalance(b=>b+1); setXp(x=>x+1);
    refresh();
  }
  async function spendTen(){
    const r = await fetch("/api/pulse/spend", {
      method:"POST",
      headers:{ "content-type":"application/json", "x-user-id":"demo-user" },
      body: JSON.stringify({ amount:10, note:"shop_item:boost" })
    });
    const j = await r.json().catch(()=>null);
    if(!r.ok) alert((j && j.error) || "Spend failed");
    else { setBalance(b=>b-((j?.spend||0)+(j?.burn||0))); refresh(); }
  }

  React.useEffect(()=>{ refresh(); },[]);
  return (
    <div style={{padding:20, display:"grid", gap:12}}>
      <h1>Harmony v2.5 — Demo</h1>
      <div style={{display:"flex", gap:12}}>
        <button onClick={earnOnce}>Watch Ad → +Pulse</button>
        <button onClick={spendTen}>Spend 10 Pulse</button>
        <button onClick={refresh}>Refresh Stats</button>
      </div>
      <div style={{display:"grid", gap:8}}>
        <div><b>Wallet (demo)</b>: {balance} Pulse | XP: {xp}</div>
        <pre style={{background:"#0b0f12", color:"#d1d5db", padding:12, borderRadius:8}}>
{JSON.stringify(stats,null,2)}
        </pre>
      </div>
    </div>
  );
}
