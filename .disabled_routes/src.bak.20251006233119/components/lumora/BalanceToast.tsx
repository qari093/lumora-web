"use client";
import React from "react";
import { useBalance } from "./BalanceContext";
export default function BalanceToast(){
  const { toasts, removeToast } = useBalance();
  if(!toasts?.length) return null;
  return (
    <div style={{ position:"fixed", right:16, bottom:16, display:"flex", flexDirection:"column", gap:8, zIndex:5000 }}>
      {toasts.map(t=>(
        <div key={t.id} onClick={()=>removeToast(t.id)}
             style={{ background:"#111827", color:"#fff", border:`1px solid ${t.color||"#444"}`, padding:"8px 12px", borderRadius:8, cursor:"pointer" }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
