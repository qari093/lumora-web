"use client";
import React from "react";
import { useBalance } from "./BalanceContext";
export default function BalanceDisplay(){
  const { balance, staked, pendingRewards } = useBalance();
  return (
    <div style={{padding:"8px 12px", border:"1px solid #333", borderRadius:8}}>
      <b>Wallet:</b> {balance}⚡ &nbsp; | &nbsp;
      <b>Staked:</b> {staked}⚡ &nbsp; | &nbsp;
      <b>Rewards:</b> {pendingRewards}⚡
    </div>
  );
}
