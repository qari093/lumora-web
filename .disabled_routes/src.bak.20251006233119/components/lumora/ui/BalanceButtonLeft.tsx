"use client";
import React from "react";
import { useLocalState } from "@/lib/zbn3d/useLocalState";
import { useLedger } from "@/lib/zbn3d/useLedger";
import LedgerDrawer from "./LedgerDrawer";

const glow = {
  animation: "lumora-glow 2.4s ease-in-out infinite",
  boxShadow: "0 0 0 0 rgba(250, 204, 21, .6)",
} as const;

const keyframes = `
@keyframes lumora-glow {
  0% { box-shadow: 0 0 0 0 rgba(250,204,21,.55); transform: scale(1); }
  70% { box-shadow: 0 0 0 16px rgba(250,204,21,0); transform: scale(1.03); }
  100% { box-shadow: 0 0 0 0 rgba(250,204,21,0); transform: scale(1); }
}
`;

export default function BalanceButtonLeft(){
  const [balance] = useLocalState<number>("wallet.balance", 1000);
  const { ledger, clear } = useLedger();
  const [open, setOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);

  const pops = [
    { label:"Wallet", onClick:()=>alert(`Balance: ${balance} ZC+`) },
    { label:"History", onClick:()=>setHistoryOpen(true) },
    { label:"Deposit" }, { label:"Withdraw" }, { label:"Settings" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div style={{
        position:"fixed", left:14, top:"50%", transform:"translateY(-50%)",
        zIndex:60, display:"flex", flexDirection:"column", gap:10, alignItems:"flex-start"
      }}>
        <button
          onClick={()=>setOpen(v=>!v)}
          title="Balance"
          style={{
            width:92, height:72, borderRadius:20, border:"1px solid #3a320e",
            background:"linear-gradient(180deg,#facc15,#d4af37)", color:"#111",
            fontWeight:900, cursor:"pointer", ...glow,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"
          }}
        >
          <div style={{ fontSize:14 }}>Balance</div>
          <div style={{ fontSize:16 }}>{balance} ZC+</div>
        </button>

        {/* Popouts */}
        <div style={{
          display:"grid", gap:8,
          transition:"all .2s ease", opacity: open? 1:0,
          pointerEvents: open? "auto":"none",
        }}>
          {pops.map((p,i)=>(
            <button key={p.label} onClick={p.onClick}
              style={{
                padding:"8px 12px", borderRadius:12, border:"1px solid #2a2a2a",
                background:"#0f1115", color:"#e5e7eb", cursor:"pointer",
                transform:`translateX(${open? 0:-8}px)`,
                transition:`all .15s ease ${i*30}ms`
              }}
            >{p.label}</button>
          ))}
        </div>
      </div>

      <LedgerDrawer open={historyOpen} onClose={()=>setHistoryOpen(false)} items={ledger} onClear={clear} />
    </>
  );
}
