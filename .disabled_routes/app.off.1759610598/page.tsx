"use client";
import React from "react";
import Link from "next/link";
import { useBattery } from "@/hooks/useBattery";
import { useLowPower } from "@/hooks/useLowPower";

export default function Home() {
  const [open,setOpen] = React.useState(false);
  const { level, saver } = useBattery();
  const { lowPower, setLowPower } = useLowPower();
  const pct = Math.round(level*100);

  return (
    <div style={{background:"#0b0f12",color:"#e5e7eb",minHeight:"100vh",padding:"20px",position:"relative"}}>
      <h1 style={{fontWeight:900,fontSize:24,marginBottom:16}}>🏠 Lumora Home</h1>
      <p style={{opacity:.85,marginBottom:20}}>Welcome back, Waqar. Explore GMAR, NEXA, and more…</p>

      {/* Main content */}
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <Link href="/gmar/aaa-game" style={pill}>🎮 Open AAA Game</Link>
        <Link href="/perf-demo" style={pill}>🎥 Battery Player Demo</Link>
      </div>

      {/* Fixed Home button -> opens Low Battery option modal */}
      <button onClick={()=>setOpen(true)} style={{
        position:"fixed", bottom:20, right:20,
        background:"linear-gradient(180deg,#22c55e,#16a34a)",
        color:"#0b0f12", fontWeight:800, fontSize:14,
        padding:"10px 14px", borderRadius:30,
        boxShadow:"0 4px 14px rgba(0,0,0,.5)", border:"none", cursor:"pointer"
      }}>
        🏠 Home
      </button>

      {open && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100}}>
          <div style={{background:"#0f1115", border:"1px solid #2a2a2a", borderRadius:14, padding:16, width:"min(90vw,440px)"}}>
            <h2 style={{fontWeight:900,fontSize:18,marginBottom:8}}>Battery & Performance</h2>
            <div style={{fontSize:14, opacity:.9, marginBottom:12}}>
              Battery: <b>{pct}%</b> {saver ? "• Data Saver ON" : ""} <span style={{opacity:.7}}>(Low Power forces Performance Mode)</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",border:"1px solid #333",borderRadius:12,background:"#111827",marginBottom:12}}>
              <div>
                <div style={{fontWeight:800}}>Low Power Mode</div>
                <div style={{fontSize:12,opacity:.8}}>Save battery by simplifying UI & forcing hardware-decoding pipeline.</div>
              </div>
              <button
                onClick={()=>setLowPower(!lowPower)}
                style={{
                  padding:"8px 12px", borderRadius:999, border:"1px solid #374151",
                  background: lowPower ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#0b0f12",
                  color: lowPower ? "#0b0f12" : "#e5e7eb", fontWeight:900, cursor:"pointer"
                }}>
                {lowPower ? "ON" : "OFF"}
              </button>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Link href="/perf-demo" style={{...pill, padding:"8px 12px"}}>Open Player</Link>
              <button onClick={()=>setOpen(false)} style={{...pillBtn}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const pill:React.CSSProperties = {
  padding:"10px 14px", borderRadius:999, border:"1px solid #2a2a2a", background:"#111827", color:"#e5e7eb", fontWeight:800, textDecoration:"none"
};
const pillBtn:React.CSSProperties = {
  padding:"8px 12px", borderRadius:10, border:"1px solid #2a2a2a", background:"#111827", color:"#e5e7eb", fontWeight:800, cursor:"pointer"
};
