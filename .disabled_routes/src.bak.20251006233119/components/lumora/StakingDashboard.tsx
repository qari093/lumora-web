"use client";
import React, { useState } from "react";
import { useBalance } from "./BalanceContext";
import { TreasuryService } from "./TreasuryService";

export default function StakingDashboard(){
  const { balance, staked, apy, pendingRewards, stake, unstake, claimRewards } = useBalance();
  const [amt, setAmt] = useState(10);
  const t = TreasuryService.getStats();

  return (
    <div style={{background:"#0b0b0b", color:"#fff", padding:14, borderRadius:10, width:320}}>
      <div style={{fontWeight:800, marginBottom:8}}>🛡️ Staking</div>
      <div style={{fontSize:13, opacity:0.9, marginBottom:6}}>
        Balance: <b>{balance}⚡</b> • Staked: <b>{staked}⚡</b> • APY: <b>{Math.round(apy*100)}%</b>
      </div>
      <div style={{fontSize:12, opacity:0.8, marginBottom:10}}>
        Treasury: total {t.totalSupply.toLocaleString()} • circulating {t.circulating.toLocaleString()} • locked {t.lockedInStaking.toLocaleString()}
      </div>
      <input type="number" value={amt} onChange={e=>setAmt(parseInt(e.target.value||"0"))}
        style={{width:"100%", padding:"8px 10px", background:"#000", color:"#fff", border:"1px solid #333", borderRadius:8, marginBottom:8}} />
      <div style={{display:"flex", gap:8, marginBottom:10}}>
        <button onClick={()=>stake(Math.max(0,amt))} style={btn}>Stake</button>
        <button onClick={()=>unstake(Math.max(0,amt))} style={btn}>Unstake</button>
      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>Pending Rewards: <b style={{color:"gold"}}>{pendingRewards}⚡</b></div>
        <button onClick={claimRewards} style={btn}>Claim</button>
      </div>
    </div>
  );
}
const btn: React.CSSProperties = { padding:"8px 12px", border:"1px solid #333", borderRadius:8, background:"#111827", color:"#fff", cursor:"pointer", fontWeight:700 };
