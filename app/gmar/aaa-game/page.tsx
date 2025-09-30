"use client";
import React from "react";
import dynamic from "next/dynamic";
const Game3DPlus = dynamic(()=>import("@/components/rbn3d/Game3DPlus"), { ssr:false });
export default function AaaGame(){
  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ margin:"0 0 8px 0" }}>🎮 Royale Battle Nexus — 3D Prototype + Zen Economy</h1>
      <p style={{ marginTop:0, color:"#9fb0c3" }}>WASD move • Space shoot • Shift sprint • Scroll zoom. Rewards are server-computed and added to your wallet.</p>
      <Game3DPlus/>
    </main>
  );
}
