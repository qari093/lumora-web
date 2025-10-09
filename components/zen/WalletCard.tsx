"use client";
import React, { useEffect, useState } from "react";

// simple client SDK copied here in case "@/lib/zen/client" path is different in your repo
async function api(path:string, init?:RequestInit){
  try{
    const r = await fetch(path, init);
    return await r.json();
  }catch(e){ return { ok:false, error:String(e) }; }
}
function dev(){ // use stored device or fallback
  try{
    const k="device-id"; let v = localStorage.getItem(k);
    if(!v){ v="dev-"+Math.random().toString(36).slice(2,10); localStorage.setItem(k,v); }
    return v;
  }catch{ return "dev-local"; }
}
async function getBalance(){
  const d = dev();
  const r = await fetch("/api/zen/ledger", { headers:{ "x-device-id": d }, cache:"no-store" }).then(r=>r.json()).catch(()=>({ ok:false }));
  return r?.balance || 0;
}
async function earn(amount:number, reason="ui_earn", opId?:string){
  const d=dev();
  const body = JSON.stringify({ action:"earn", amount, reason, opId: opId || "ui_"+Date.now() });
  return api("/api/zen/ledger", { method:"POST", headers:{ "Content-Type":"application/json","x-device-id":d }, body });
}
async function spend(amount:number, reason="ui_spend", opId?:string){
  const d=dev();
  const body = JSON.stringify({ action:"spend", amount, reason, opId: opId || "ui_"+Date.now() });
  return api("/api/zen/ledger", { method:"POST", headers:{ "Content-Type":"application/json","x-device-id":d }, body });
}
async function claimDaily(){
  const d=dev();
  return api("/api/zen/bonus", { method:"POST", headers:{ "x-device-id": d } });
}

export default function WalletCard(){
  const [bal,setBal] = useState<number>(0);
  const [busy,setBusy] = useState(false);
  const [msg,setMsg] = useState<string>("");

  async function refresh(){ setBal(await getBalance()); }
  useEffect(()=>{ refresh(); },[]);

  async function onDaily(){
    setBusy(true);
    const r = await claimDaily();
    setBusy(false);
    if (r.ok){ setBal(r.balance||0); setMsg("Daily claimed! +5"); }
    else setMsg(r.error || "Failed");
  }
  async function onTestEarn(){ setBusy(true); const r = await earn(1,"ui_test","ui_earn"); setBusy(false); if(r.ok) setBal(r.balance||0); }
  async function onTestSpend(){ setBusy(true); const r = await spend(1,"ui_test_spend","ui_spend"); setBusy(false); if(r.ok) setBal(r.balance||0); else setMsg(r.error||"Spend failed"); }

  return (
    <div style={{background:"#111214", border:"1px solid #26272b", borderRadius:12, padding:16}}>
      <div style={{fontWeight:800, fontSize:18, marginBottom:8}}>Zen Wallet</div>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <div style={{background:"#18181b", padding:"8px 12px", borderRadius:8}}>Balance: <b>{bal}</b></div>
        <button onClick={refresh} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:8}}>Refresh</button>
        <button onClick={onDaily} disabled={busy} style={{background:"#22c55e", color:"#fff", padding:"6px 10px", borderRadius:8}}>Claim Daily +5</button>
      </div>
      <div style={{display:"flex", gap:8, marginTop:10}}>
        <button onClick={onTestEarn} disabled={busy} style={{background:"#4f46e5", color:"#fff", padding:"6px 10px", borderRadius:8}}>+1 (test)</button>
        <button onClick={onTestSpend} disabled={busy} style={{background:"#ef4444", color:"#fff", padding:"6px 10px", borderRadius:8}}>-1 (test)</button>
      </div>
      {msg && <div style={{opacity:.8, marginTop:8}}>{msg}</div>}
    </div>
  );
}
