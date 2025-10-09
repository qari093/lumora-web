"use client";
import React from "react";
import { useZenEconomy } from "./ZenEconomyProvider";

export default function PendingRewards() {
  const { state, refresh } = useZenEconomy();

  return (
    <button onClick={refresh}
      style={{padding:"6px 10px",borderRadius:10,border:"1px solid #444",background:"#111827",color:"#fff",cursor:"pointer"}}>
      Rewards: <span suppressHydrationWarning>{state.pendingRewards}</span>
    </button>
  );
}
