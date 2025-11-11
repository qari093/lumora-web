"use client";

import React from "react";

type HarmonyBarProps = {
  value: number;
  max?: number;
};

export default function HarmonyBar({ value, max = 100 }: HarmonyBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      style={{
        width: "100%",
        height: 8,
        borderRadius: 9999,
        background: "rgba(34,197,94,0.2)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg,#22c55e,#16a34a)",
          borderRadius: 9999,
          transition: "width 0.3s ease-out",
        }}
      />
    </div>
  );
}
