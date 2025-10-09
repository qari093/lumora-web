#!/usr/bin/env bash
set -e

mkdir -p src/app/live/main-room
cat > src/app/live/main-room/page.tsx <<'TSX'

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
TSX

pkill -f "next dev" >/dev/null 2>&1 || true
PORT=${PORT:-3000} npx next dev
