"use client";

import React from "react";
import HeaderLogo from "./HeaderLogo";
import GlbUpload from "@/components/zbn3d/GlbUpload";
import SampleBar from "@/components/zbn3d/SampleBar";
import ActionDockRight from "@/components/lumora/ui/ActionDockRight";
import BalanceButtonLeft from "@/components/lumora/ui/BalanceButtonLeft";
import BuyHandCTA from "@/components/lumora/ui/BuyHandCTA";
import LoadoutPanel from "@/components/lumora/ui/LoadoutPanel";

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <HeaderLogo />
      <div style={{ marginTop: 6, marginBottom: 8, opacity:.8 }}>
        <b>Hero Lab</b> — GLB فائل دیں یا نیچے سے Sample منتخب کریں۔
      </div>

      {/* Main content */}
      <GlbUpload />
      <SampleBar />

      {/* Overlays */}
      <ActionDockRight
        onLike={()=>console.log("Like")}
        onComment={()=>console.log("Comment")}
        onShare={()=>console.log("Share")}
        onEarn={()=>console.log("Earn")}
      />
      <BalanceButtonLeft />
      <BuyHandCTA />
      <LoadoutPanel />
    </div>
  );
}
