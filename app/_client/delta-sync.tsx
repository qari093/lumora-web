"use client";
import React, { useState, useEffect } from "react";

export default function DeltaSync() {
  const [q, setQ] = useState(0);
  const [clk, setClk] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent<any>) => {
      const { type, id } = e.detail || {};
      console.log("[DeltaSync] simulated op", type, id);
      setQ((x) => x + 1);
      setClk(Date.now());
    };
    window.addEventListener("lumora:delta-sim", handler as any);
    return () => window.removeEventListener("lumora:delta-sim", handler as any);
  }, []);

  return (
    <div style={{
      position: "fixed", bottom: 64, left: 12,
      background: "#111", color: "#0f0",
      padding: "6px 10px", borderRadius: 6,
      fontSize: 12, opacity: 0.9, fontFamily: "monospace"
    }}>
      Delta • q:{q} • clk:{clk ? clk.toString().slice(-6) : 0}
    </div>
  );
}
