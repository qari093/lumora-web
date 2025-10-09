"use client";
import React from "react";
import LiveRoom from "@/components/lumalink/LiveRoom";

export default function LiveMainRoomPage() {
  return (
    <div style={{ padding:20 }}>
      <h1 style={{ marginBottom:12 }}>🌟 Lumora Live — Main Room (WebRTC)</h1>
      <LiveRoom roomId="main-room" />
    </div>
  );
}
