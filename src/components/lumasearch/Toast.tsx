"use client";
import React from "react";
export default function Toast({msg, onClose}:{msg:string|null; onClose:()=>void}){
  React.useEffect(()=>{
    if(!msg) return;
    const t = setTimeout(onClose, 3000);
    return ()=>clearTimeout(t);
  },[msg,onClose]);
  if(!msg) return null;
  return (
    <div style={{
      position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
      background:"#111827", color:"#e5e7eb", border:"1px solid #374151",
      padding:"10px 14px", borderRadius:10, zIndex:100
    }}>
      {msg}
    </div>
  );
}
