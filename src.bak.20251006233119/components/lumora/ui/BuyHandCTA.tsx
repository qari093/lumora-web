"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

const breathe = `
@keyframes breathe {
  0% { transform: scale(1) translateZ(0); }
  50% { transform: scale(1.04) translateZ(0); }
  100% { transform: scale(1) translateZ(0); }
}
`;

export default function BuyHandCTA(){
  const query = useSearchParams();
  const router = useRouter();
  const campaign = query.get("campaign") || "default";

  function onBuy(){
    // 🔔 log Zencoin spend event
    console.log("[Zencoin TX] User clicked BUY", { campaign, amount: 10, currency: "ZC+" });
    // Navigate to checkout page with campaign param
    router.push(\`/checkout?campaign=\${encodeURIComponent(campaign)}\`);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: breathe }} />
      <div style={{
        position:"fixed", left:90, top:"40%", transform:"translateY(-40%)",
        zIndex:55, display:"flex", flexDirection:"column", alignItems:"center", gap:8
      }}>
        <img src="/cta/hand.svg" alt="Hand" width={120} height={120}
             style={{ filter:"drop-shadow(0 10px 24px rgba(0,0,0,.35))", animation:"breathe 3s ease-in-out infinite" }}/>
        <button onClick={onBuy}
          style={{
            padding:"10px 16px", borderRadius:14, fontWeight:900, letterSpacing:.5,
            border:"1px solid #3a320e", background:"linear-gradient(180deg,#f8d14a,#d4af37)", color:"#111",
            boxShadow:"0 8px 24px rgba(0,0,0,.35)", cursor:"pointer"
          }}>
          BUY
        </button>
        <div style={{ fontSize:12, color:"#a3a3a3" }}>cmp: {campaign}</div>
      </div>
    </>
  );
}
