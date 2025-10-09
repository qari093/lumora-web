"use client";
import React from "react";
import WalletBadge from "@/components/zen/WalletBadge";
import PendingRewards from "@/components/zen/PendingRewards";

export default function ZenEconomyDevPage() {
  return (
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:12,color:"#e5e7eb",background:"#0a0f14",minHeight:"100vh"}}>
      <h1 style={{margin:0}}>Zen Economy — Hydration-safe Demo</h1>
      <div style={{opacity:.7,fontSize:14}}>SSR outputs stable placeholders; values upgrade after hydration without mismatch.</div>
      <WalletBadge />
      <PendingRewards />
      <p style={{opacity:.8,maxWidth:680}}>
        Tip: reload the page and watch there are <strong>no hydration warnings</strong> in dev console.
        The server sends placeholders identical to the client initial state; then client loads real data.
      </p>
    </div>
  );
}
