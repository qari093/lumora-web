"use client";
import React from "react";
import { useZenEconomy } from "./ZenEconomyProvider";
import { useIsHydrated } from "@/hooks/useIsHydrated";

export default function WalletBadge() {
  const { state } = useZenEconomy();
  const hydrated = useIsHydrated();

  // Render the SAME DOM structure for SSR+CSR.
  // Use text placeholders that match initial state.
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 10px",border:"1px solid #333",borderRadius:10,background:"#0b0f12",color:"#e5e7eb"}}>
      <span style={{opacity:.85}}>Wallet:</span>
      <span suppressHydrationWarning>
        {state.walletAddress ?? "—"}
      </span>
      <span style={{marginLeft:12,opacity:.85}}>Bal:</span>
      <span suppressHydrationWarning title={hydrated && state.lastUpdatedISO ?  : undefined}>
        {state.balance.toFixed(1)} {state.balanceCurrency}
      </span>
    </div>
  );
}
