"use client";
import React from "react";
import Link from "next/link";
import { GLASS, shell, Card, btn } from "@/app/ui/_lux/theme";

export default function CreatorHome() {
  return (
    <div style={shell}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <h1 style={{ margin:0 }}>Creator Dashboard</h1>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Link href="/lumalink" style={btn(true)}>🪄 LumaLink</Link>
          <Link href="/lumalink/chat" style={btn()}>💬 Chat</Link>
          <Link href="/lumalink/room" style={btn()}>🎥 Room</Link>
        </div>
      </div>

      <Card title="Welcome">
        <p style={{ opacity:.9 }}>Your creator tools are here. LumaLink lets you chat with your audience and jump into live rooms instantly.</p>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:12 }}>
        <div style={{ ...GLASS, padding:16 }}><strong>Upload</strong><p style={{ opacity:.8 }}>Post new content.</p><Link href="/creator/upload" style={btn(true)}>Open</Link></div>
        <div style={{ ...GLASS, padding:16 }}><strong>Studio</strong><p style={{ opacity:.8 }}>Manage your posts.</p><Link href="/creator/studio" style={btn(true)}>Open</Link></div>
        <div style={{ ...GLASS, padding:16 }}><strong>Analytics</strong><p style={{ opacity:.8 }}>Track performance.</p><Link href="/creator/analytics" style={btn(true)}>Open</Link></div>
        <div style={{ ...GLASS, padding:16 }}><strong>Quests</strong><p style={{ opacity:.8 }}>Engage & earn.</p><Link href="/creator/quests" style={btn(true)}>Open</Link></div>
        <div style={{ ...GLASS, padding:16 }}><strong>Rewards</strong><p style={{ opacity:.8 }}>Claim perks.</p><Link href="/creator/rewards" style={btn(true)}>Open</Link></div>
      </div>

      <div style={{ marginTop:12, display:"flex", gap:10, flexWrap:"wrap" }}>
        <Link href="/lumalink" style={btn(true)}>🪄 Open LumaLink Hub</Link>
        <Link href="/lumalink/chat" style={btn()}>💬 Open Chat</Link>
        <Link href="/lumalink/room" style={btn()}>🎥 Start Room</Link>
      </div>
    </div>
  );
}
