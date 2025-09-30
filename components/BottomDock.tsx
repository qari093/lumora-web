"use client";
import Link from "next/link";
import React from "react";

export default function BottomDock(){
  const base: React.CSSProperties = {
    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
    background: "#0f0f12", borderTop: "1px solid #27272a"
  };
  const wrap: React.CSSProperties = {
    maxWidth: 1100, margin: "0 auto", padding: "10px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  };
  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "#18181b", border: "1px solid #27272a",
    color: "#e5e7eb", padding: "8px 12px", borderRadius: 10
  };
  return (
    <nav style={base} aria-label="Bottom">
      <div style={wrap}>
        <Link href="/nexa" style={btn}>NEXA</Link>
        <Link href="/" style={{...btn, background:"#4f46e5",color:"#fff"}}>Home</Link>
        <Link href="/gmar" style={btn}>Gmar</Link>
      </div>
    </nav>
  );
}
