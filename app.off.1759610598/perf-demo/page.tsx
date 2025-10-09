"use client";
import React, { useState } from "react";
import BatterySmartPlayer from "@/components/video/BatterySmartPlayer";

export default function PerfDemo(){
  const [mode,setMode]=useState<"performance"|"interactive">("interactive");
  return (
    <div style={{padding:20, color:"#e5e7eb", background:"#0b0f12", minHeight:"100vh"}}>
      <h1 style={{fontWeight:900, fontSize:22, marginBottom:12}}>🔋 Lumora Battery-Smart Player</h1>
      <div style={{display:"flex", gap:12, marginBottom:16}}>
        <button onClick={()=>setMode("performance")} style={btn(mode==="performance")}>Performance</button>
        <button onClick={()=>setMode("interactive")} style={btn(mode==="interactive")}>Interactive</button>
      </div>
      <BatterySmartPlayer
        sources={[ { src:"/videos/intro.mp4", type:"video/mp4" } ]}
        poster="/lumora-logo.svg"
        autoPlay
        defaultMode={mode}
        showControls={false}
      />
    </div>
  );
}
function btn(active:boolean):React.CSSProperties{
  return {
    padding:"8px 12px",
    borderRadius:10,
    border:"1px solid #333",
    background: active ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#111827",
    color: active ? "#0b0f12" : "#e5e7eb",
    fontWeight:800,
    cursor:"pointer"
  };
}
