"use client";
import React from "react";
import Link from "next/link";

export default function Page(){
  const pill: React.CSSProperties = {
    padding:"10px 14px",
    borderRadius:999,
    border:"1px solid rgba(255,255,255,0.15)",
    textDecoration:"none",
    fontWeight:800,
    color:"#fff",
    background:"rgba(255,255,255,0.08)",
    display:"inline-block",
    marginRight:8
  };
  return (
    <div style={{minHeight:"100vh", background:"#0b0f12", color:"#fff", padding:16}}>
      <h1 style={{marginBottom:12}}>Lumora LUX — Home Notches</h1>

      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <a href="#" style={pill}>Live</a>
        <a href="#" style={pill}>Explore</a>
        <a href="#" style={pill}>Following</a>
      </div>

      <div style={{marginTop:10}}>
        <Link href="/creator" style={pill}>Creator</Link>
        <Link href="/creator/analytics" style={pill}>Analytics</Link>
        <Link href="/wallet" style={pill}>Wallet</Link>
        <Link href="/leaderboard" style={pill}>Leaderboard</Link>
        <Link href="/zenshop" style={pill}>ZenShop</Link>
      </div>

      <h3 style={{marginTop:18, marginBottom:8}}>LumaLink</h3>
      <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
        <Link href="/lumalink" style={pill}>🪄 Hub</Link>
        <Link href="/lumalink/chat" style={pill}>💬 Chat</Link>
        <Link href="/lumalink/room" style={pill}>🎥 Room</Link>
      </div>

      <p style={{opacity:.7, marginTop:14}}>✅ LumaLink entrypoints added here and in Creator Dashboard.</p>
    </div>
  );
}
