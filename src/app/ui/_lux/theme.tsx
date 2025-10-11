"use client";
import React from "react";
export const BG = "#0b0f12";
export const SURFACE = "rgba(255,255,255,0.06)";
export const BORDER = "1px solid rgba(255,255,255,0.10)";
export const GLASS: React.CSSProperties = {
  background: SURFACE, border: BORDER,
  backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.35)", borderRadius: 16,
};
export const shell: React.CSSProperties = { padding:20, color:"#fff" };
export function Card(props:{title:string;children?:React.ReactNode; right?:React.ReactNode}) {
  return (
    <div style={{...GLASS, padding:16, marginBottom:12}}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8}}>
        <h1 style={{margin:0}}>{props.title}</h1>
        <div>{props.right}</div>
      </div>
      <div>{props.children}</div>
    </div>
  );
}
export const btn = (accent=false): React.CSSProperties => ({
  padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.15)",
  background: accent ? "linear-gradient(180deg,#fbd34d,#d4a017)" : SURFACE,
  color: accent ? "#111" : "#fff", fontWeight:800, cursor:"pointer"
});
