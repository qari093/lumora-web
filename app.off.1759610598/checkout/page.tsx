"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useLocalState } from "@/lib/zbn3d/useLocalState";
import { useLedger } from "@/lib/zbn3d/useLedger";

export default function CheckoutPage(){
  const query = useSearchParams();
  const campaign = query.get("campaign") || "default";
  const [balance, setBalance] = useLocalState<number>("wallet.balance", 1000);
  const { add } = useLedger();

  function confirm(){
    const price = 10; // 10 ZC+ per item
    if(balance < price){
      alert("❌ Not enough Zencoin+");
      return;
    }
    const newBal = balance - price;
    setBalance(newBal);

    // Record ledger tx
    add({
      id: String(Date.now()),
      ts: Date.now(),
      amount: price,
      currency: "ZC+",
      campaign,
      note: "Hero Lab purchase"
    });

    alert(`✅ Purchase confirmed! -${price} ZC+ | New Balance: ${newBal} ZC+`);
    console.log("[Zencoin TX]", { campaign, amount: price, currency: "ZC+" });
  }

  return (
    <div style={{ padding:30 }}>
      <h1 style={{ fontSize:24, fontWeight:800, marginBottom:12 }}>🛒 Checkout</h1>
      <p style={{ marginBottom:8 }}>Campaign: <b>{campaign}</b></p>
      <p style={{ marginBottom:8 }}>Price: <b>10 ZC+</b></p>
      <p style={{ marginBottom:8 }}>Your Balance: <b>{balance} ZC+</b></p>
      <button onClick={confirm}
        style={{
          padding:"12px 20px", borderRadius:12,
          background:"linear-gradient(180deg,#22c55e,#16a34a)", color:"#fff",
          fontWeight:700, border:"none", cursor:"pointer"
        }}>
        Confirm Purchase
      </button>
    </div>
  );
}
