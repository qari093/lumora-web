"use client";
import React from "react";
import { useEnergy } from "@/hooks/useEnergy";

function fmt(ms:number){
  const s = Math.max(0, Math.floor(ms/1000));
  const m = Math.floor(s/60), r = s%60;
  return m>0 ? \`\${m}m \${r}s\` : \`\${r}s\`;
}

export default function EnergyStormBanner(){
  const { event, crew, joinDemo } = useEnergy();
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(()=>{
    const id = setInterval(()=>setNow(Date.now()), 1000);
    return ()=>clearInterval(id);
  }, []);
  if(!event) return null;

  const remaining = Math.max(0, event.end - now);
  const active = now >= event.start && now <= event.end;
  if(!active) return null;

  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, zIndex:9998,
      display:"flex", alignItems:"center", justifyContent:"center", gap:12,
      padding:"10px 12px",
      background:"linear-gradient(90deg, #22c55e, #84cc16)",
      color:"#0b0f12", fontWeight:900, letterSpacing:0.2,
      boxShadow:"0 10px 30px rgba(0,0,0,0.35)"
    }}>
      <span>⚡ Energy Storm <span style={{ opacity:.8 }}>(×{event.multiplier})</span></span>
      <span>•</span>
      <span>Ends in {fmt(remaining)}</span>
      {!crew && (
        <>
          <span>•</span>
          <button onClick={joinDemo} style={{
            padding:"6px 10px", borderRadius:999, border:"1px solid rgba(0,0,0,0.15)",
            background:"rgba(255,255,255,0.9)", cursor:"pointer", fontWeight:900
          }}>Join Crew</button>
        </>
      )}
    </div>
  );
}
