// src/components/core/FooterNav.tsx
"use client";
import React from "react";
import Link from "next/link";

export default function FooterNav() {
  const link: React.CSSProperties = {
    padding: "6px 10px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    textDecoration: "none",
    fontSize: 13,
    lineHeight: 1,
    WebkitBackdropFilter: "blur(6px)",
    backdropFilter: "blur(6px)",
  };

  return (
    <div
      role="contentinfo"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        display: "flex",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none", // don’t block swipes/taps on the feed
      }}
    >
      <nav
        aria-label="Footer"
        style={{
          display: "flex",
          gap: 12,
          pointerEvents: "auto",
          background: "rgba(0,0,0,0.35)",
          padding: 8,
          borderRadius: 12,
        }}
      >
        <Link href="/fyp" style={link}>FYP</Link>
        <Link href="/gmar/referrals" style={link}>Referrals</Link>
        <Link href="/admin/gmar" style={link}>Admin</Link>
      </nav>
    </div>
  );
}