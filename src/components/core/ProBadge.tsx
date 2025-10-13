"use client";
import React from "react";

export default function ProBadge(){
  const [isPro, setIsPro] = React.useState(false);
  React.useEffect(()=>{
    // Heuristic: entitlement cookie present -> show badge
    setIsPro(document.cookie.includes("lumora_entitlements"));
  }, []);
  if(!isPro) return null;
  return (
    <div style={{
      position:"fixed", top:10, right:12,
      background:"linear-gradient(90deg,#fef08a,#facc15)",
      color:"#111", fontWeight:900, fontSize:12,
      padding:"3px 8px", borderRadius:8, boxShadow:"0 0 12px rgba(255,255,200,0.6)",
      zIndex:9999
    }}>PRO</div>
  );
}
