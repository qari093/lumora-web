"use client";
import React, { useState } from "react";
import { useBalance } from "./BalanceContext";
import StakingDashboard from "./StakingDashboard";
import ReferralManager from "./ReferralManager";

export default function BalanceButton() {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStake, setShowStake] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const { balance, add, spend, txs } = useBalance();

  const actions = [
    { label: "Earn +10", fn: () => add(10) },
    { label: "Spend -5", fn: () => spend(5) },
    { label: "Stake", fn: () => { setShowStake(s=>!s); setShowReferral(false);} },
    { label: "Referral", fn: () => { setShowReferral(s=>!s); setShowStake(false);} },
    { label: "History", fn: () => setShowHistory(!showHistory) }
  ];

  const getColor = (amt:number) => amt > 0 ? "limegreen" : amt < 0 ? "crimson" : "gold";

  return (
    <div style={{ position: "fixed", left: 12, top: "40%", zIndex: 1000 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "gold", display: "flex", justifyContent: "center", alignItems: "center",
          fontWeight: 800, cursor: "pointer",
          boxShadow: open ? "0 0 20px 5px rgba(255,215,0,0.8)" : "0 0 10px 2px rgba(255,215,0,0.5)",
          transition: "all 0.3s ease-in-out"
        }}
      >
        {balance}⚡
      </div>

      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {actions.map((a, i) => (
            <button key={i} onClick={a.fn} style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid #333",
              background: "#111827", color: "#fff", cursor: "pointer", fontWeight: 600
            }}>
              {a.label}
            </button>
          ))}
        </div>
      )}

      {showHistory && (
        <div style={{
          marginTop: 12, background:"#000", color:"#fff",
          padding:10, borderRadius:8, maxHeight:220, overflowY:"auto", width:260
        }}>
          <div style={{fontWeight:700, marginBottom:6}}>History</div>
          {txs.length === 0 && <div style={{opacity:0.7}}>No transactions</div>}
          {txs.map(tx=>(
            <div key={tx.id} style={{ fontSize:13, marginBottom:4, color: getColor(tx.amount), fontWeight:600 }}>
              [{tx.time}] {tx.type} {tx.amount}⚡
            </div>
          ))}
        </div>
      )}

      {showStake && (
        <div style={{ marginTop: 12 }}>
          <StakingDashboard />
        </div>
      )}

      {showReferral && (
        <div style={{ marginTop: 12 }}>
          <ReferralManager />
        </div>
      )}
    </div>
  );
}
