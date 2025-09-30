"use client";
import React from "react";
export default function HUD({score,best,coins,onFull}:{score:number; best:number; coins:number; onFull:()=>void}){
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <div>Score: {score} &nbsp; Best: {best}</div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{background:"#111214",border:"1px solid #26272b",padding:"6px 10px",borderRadius:8}}>ZenCoins: {coins}</div>
        <button onClick={onFull} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>Fullscreen</button>
      </div>
    </div>
  );
}
