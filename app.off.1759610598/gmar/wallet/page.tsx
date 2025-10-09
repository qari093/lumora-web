"use client";
import React, { useEffect, useState } from "react";
export default function WalletPage(){
  const [bal,setBal]=useState(0);
  const [hist,setHist]=useState<any[]>([]);
  const [streak,setStreak]=useState<{streak:number; lastClaim?:string; todayClaimed:boolean}>({streak:0,todayClaimed:false});
  const [adId,setAdId]=useState("ad_demo_1");
  async function load(){ try{
    const r = await fetch("/api/zen/ledger",{ headers:{ "x-device-id":"dev1" }, cache:"no-store" }); const j=await r.json(); setBal(j.balance||0); setHist(j.history||[]);
    const s = await fetch("/api/zen/streak",{ headers:{ "x-device-id":"dev1" }, cache:"no-store" }); const sj=await s.json(); setStreak(sj);
  }catch{} }
  useEffect(()=>{ load(); },[]);
  async function earn(n:number,reason:string){ await fetch("/api/zen/ledger",{ method:"POST", headers:{ "Content-Type":"application/json","x-device-id":"dev1" }, body: JSON.stringify({ action:"earn", amount:n, reason, opId:String(Math.random()) }) }); load(); }
  async function spend(n:number,reason:string){ await fetch("/api/zen/ledger",{ method:"POST", headers:{ "Content-Type":"application/json","x-device-id":"dev1" }, body: JSON.stringify({ action:"spend", amount:n, reason, opId:String(Math.random()) }) }); load(); }
  async function bonus(){ await fetch("/api/zen/bonus",{ method:"POST", headers:{ "x-device-id":"dev1" } }); load(); }
  async function claimStreak(){ await fetch("/api/zen/streak",{ method:"POST", headers:{ "x-device-id":"dev1" } }); load(); }
  async function ad(kind:"view"|"click"){ await fetch("/api/zen/redeem/ad",{ method:"POST", headers:{ "Content-Type":"application/json","x-device-id":"dev1" }, body: JSON.stringify({ adId, kind }) }); load(); }
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh",fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:10}}>💰 Zen Wallet</h1>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12}}>Balance: <b>{bal} ZC</b></div>
        <button onClick={()=>bonus()} style={{background:"#22c55e",color:"#fff",padding:"8px 10px",borderRadius:8}}>Daily Bonus +5</button>
        <button onClick={claimStreak} style={{background:"#06b6d4",color:"#fff",padding:"8px 10px",borderRadius:8}}>{streak.todayClaimed ? "Streak Claimed" : "Claim Streak"}</button>
        <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12}}>Streak: <b>{streak.streak}</b> {streak.todayClaimed ? "(today claimed)" : ""}</div>
        <button onClick={()=>earn(2,"manual")} style={{background:"#3f3f46",color:"#fff",padding:"8px 10px",borderRadius:8}}>Earn +2</button>
        <button onClick={()=>spend(1,"spend")} style={{background:"#ef4444",color:"#fff",padding:"8px 10px",borderRadius:8}}>Spend -1</button>
      </div>
      <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12,padding:12,marginBottom:12}}>
        <div style={{fontWeight:700,marginBottom:8}}>Ad Rewards Tester</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input value={adId} onChange={e=>setAdId(e.target.value)} placeholder="ad id" style={{background:"#0b0b0f",color:"#fff",border:"1px solid #26272b",borderRadius:8,padding:"6px 10px"}}/>
          <button onClick={()=>ad("view")} style={{background:"#2563eb",color:"#fff",padding:"6px 10px",borderRadius:8}}>View +1 (cap 3/ad/day)</button>
          <button onClick={()=>ad("click")} style={{background:"#f59e0b",color:"#fff",padding:"6px 10px",borderRadius:8}}>Click +3 (cap 5/ad/day)</button>
          <div style={{opacity:.7,fontSize:12}}>Daily total cap across ads: 20 coins</div>
        </div>
      </div>
      <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12}}>
        {hist.slice().reverse().map((x,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"160px 120px 100px 1fr",padding:"8px 12px",borderBottom:"1px solid #26272b"}}>
            <div style={{opacity:.7}}>{new Date(x.at).toLocaleString()}</div>
            <div>{x.action}</div>
            <div>{x.amount}</div>
            <div style={{opacity:.7}}>{x.reason}</div>
          </div>
        ))}
        {hist.length===0 && <div style={{padding:12,opacity:.7}}>No transactions yet.</div>}
      </div>
    </main>
  );
}
