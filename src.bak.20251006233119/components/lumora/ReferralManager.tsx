"use client";
import React, { useState } from "react";
import { useBalance } from "./BalanceContext";

export default function ReferralManager(){
  const { myCode, myReferrerCode, setReferrer, referralEarnings, simulateReferredActivity } = useBalance();
  const [ref, setRef] = useState("");
  const [simAmt, setSimAmt] = useState(1000);

  const copy = async () => {
    try { await navigator.clipboard.writeText(myCode); } catch {}
  };

  return (
    <div style={{background:"#0b0b0b", color:"#fff", padding:14, borderRadius:10, width:320}}>
      <div style={{fontWeight:800, marginBottom:8}}>🤝 Referrals</div>
      <div style={{fontSize:13, marginBottom:8}}>Your Code: <b style={{color:"gold"}}>{myCode}</b> <button onClick={copy} style={smallBtn}>Copy</button></div>
      <div style={{fontSize:13, marginBottom:8}}>Referrer: <b>{myReferrerCode || "Not set"}</b></div>

      <div style={{display:"flex", gap:6, marginBottom:8}}>
        <input placeholder="Enter referrer code" value={ref} onChange={e=>setRef(e.target.value)}
          style={{flex:1, padding:"8px 10px", background:"#000", color:"#fff", border:"1px solid #333", borderRadius:8}} />
        <button onClick={()=>setReferrer(ref)} style={btn}>Set</button>
      </div>

      <div style={{fontSize:13, marginBottom:8}}>Lifetime Earnings: <b style={{color:"limegreen"}}>{referralEarnings}⚡</b></div>

      <div style={{fontSize:12, opacity:0.8, marginBottom:6}}>Simulate referred user earning:</div>
      <div style={{display:"flex", gap:6}}>
        <input type="number" value={simAmt} onChange={e=>setSimAmt(parseInt(e.target.value||"0"))}
          style={{flex:1, padding:"8px 10px", background:"#000", color:"#fff", border:"1px solid #333", borderRadius:8}} />
        <button onClick={()=>simulateReferredActivity(Math.max(0,simAmt))} style={btn}>Simulate</button>
      </div>
    </div>
  );
}
const btn: React.CSSProperties = { padding:"8px 12px", border:"1px solid #333", borderRadius:8, background:"#111827", color:"#fff", cursor:"pointer", fontWeight:700 };
const smallBtn: React.CSSProperties = { padding:"6px 10px", border:"1px solid #333", borderRadius:8, background:"#111827", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:12 };
