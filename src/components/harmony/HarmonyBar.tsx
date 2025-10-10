"use client";
import React from "react";

export default function HarmonyBar({ xp }:{ xp:number }){
  const level = Math.floor(xp/100);
  const pct = Math.min(100, xp % 100);
  return (
    <div style={{padding:8}}>
      <div style={{fontWeight:700, marginBottom:6}}>Harmony Lv.{level}</div>
      <div style={{height:10, background:"#111827", borderRadius:6, overflow:"hidden"}}>
        <div style={{width: , height:"100%", background:"linear-gradient(90deg,#22c55e,#16a34a)"}} />
      </div>
    </div>
  );
}
