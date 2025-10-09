
"use client";
import React from "react";
import VideoInterface from "@/components/lumora/video-interface";
import { BalanceProvider } from "@/components/lumora/BalanceContext";

export default function LiveMainRoomPage() {
  return (
    <BalanceProvider>
      <div style={{ width:"100%", height:"100vh", background:"#000" }}>
        <VideoInterface />
      </div>
    </BalanceProvider>
  );
}
