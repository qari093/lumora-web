import React, { useEffect, useState } from "react";
import { BalanceProvider, useBalance } from "@/components/lumora/BalanceContext";
import StakingDashboard from "@/components/lumora/StakingDashboard";
import ReferralManager from "@/components/lumora/ReferralManager";

type Step = { id:number; label:string; status:"pending"|"done"|"error"; note?:string };

function AutoRunner(){
  const { add, spend, stake, unstake, claimRewards, simulateReferredActivity, txs, balance } = useBalance() as any;
  const [steps, setSteps] = useState<Step[]>([
    {id:1, label:"Earn 100", status:"pending"},
    {id:2, label:"Stake 50", status:"pending"},
    {id:3, label:"Claim Rewards", status:"pending"},
    {id:4, label:"Simulate Referral (1,000)", status:"pending"},
    {id:5, label:"Unstake 20", status:"pending"},
    {id:6, label:"Spend 30", status:"pending"},
    {id:7, label:"Validate Tx History", status:"pending"},
  ]);
  const [started, setStarted] = useState(false);
  const mark = (id:number, status:Step["status"], note?:string)=>setSteps(s=>s.map(st=>st.id===id?{...st,status,note}:st));
  useEffect(()=>{
    if(started) return;
    setStarted(true);
    (async ()=>{
      try{
        add?.(100);            mark(1,"done"); await new Promise(r=>setTimeout(r,200));
        stake?.(50);           mark(2,"done"); await new Promise(r=>setTimeout(r,200));
        claimRewards?.();      mark(3,"done"); await new Promise(r=>setTimeout(r,200));
        simulateReferredActivity?.(1000); mark(4,"done"); await new Promise(r=>setTimeout(r,200));
        unstake?.(20);         mark(5,"done"); await new Promise(r=>setTimeout(r,200));
        spend?.(30);           mark(6,"done"); await new Promise(r=>setTimeout(r,200));
        const ok = Array.isArray(txs) && txs.length >= 6;
        mark(7, ok?"done":"error", ok?"OK":"Transactions < 6");
      }catch(e:any){ mark(7,"error", e?.message||"failed"); }
    })();
  },[started, add, spend, stake, unstake, claimRewards, simulateReferredActivity, txs]);

  const pill = (st:Step["status"])=>({
    background: st==="done"?"#065f46": (st==="error"?"#7f1d1d":"#374151"),
    border:"1px solid #333", color:"#fff", padding:"6px 10px", borderRadius:8, fontWeight:700
  } as React.CSSProperties);

  return (
    <div style={{ padding:20, background:"#000", color:"#fff", minHeight:"100vh" }}>
      <h1 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>⚡ Zencoin Auto Test (Pages Router)</h1>
      <div style={{opacity:0.85, marginBottom:12}}>Route: <code>/dev/zencoin/auto-test</code></div>
      <div style={{marginBottom:16}}>💰 Current Balance: <b>{balance}</b> ⚡</div>
      <div style={{display:"grid", gap:8}}>
        {steps.map(s=>(
          <div key={s.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", background:"#111827", padding:"10px 12px", borderRadius:8}}>
            <div>{s.id}. {s.label} {s.note && <span style={{opacity:0.8}}>— {s.note}</span>}</div>
            <span style={pill(s.status)}>{s.status.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex", gap:16, flexWrap:"wrap", marginTop:20}}>
        <StakingDashboard />
        <ReferralManager />
      </div>
    </div>
  );
}

export default function Page(){ return <BalanceProvider><AutoRunner/> </BalanceProvider>; }
