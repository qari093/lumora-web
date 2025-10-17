export const dynamic = "force-dynamic";
"use client";
import React from "react";
import RewardedWallet from "@/components/ads/RewardedWallet";

export default function WalletPage(){
  return (
    <main style={{padding:"16px",color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:20}}>Zen Wallet</h1>
      <p style={{opacity:.8}}>Tap the button below to watch a rewarded ad and earn +1 Zen.</p>
      <div style={{marginTop:12}}>
        <RewardedWallet onReward={()=>{}} />
      </div>
    </main>
  );
}
