"use client";
import React from "react";

type Props = {
  name?: string;
  selected?: boolean;
  onSelect?: (n: string) => void;
};

export default function HeroModel({ name = "Default Hero", selected = false, onSelect }: Props) {
  return (
    <div
      role="button"
      aria-label={`Select ${name}`}
      tabIndex={0}
      onClick={() => onSelect?.(name)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(name)}
      style={{
        width: 180,
        height: 280,
        border: selected ? "3px solid #ffd700" : "2px solid #888",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: selected
          ? "linear-gradient(145deg, #1f1f1f, #3a2f00)"
          : "linear-gradient(145deg,#222,#444)",
        color: "white",
        fontSize: 18,
        cursor: "pointer",
        boxShadow: selected
          ? "0 0 18px rgba(255,215,0,0.55)"
          : "0 2px 10px rgba(0,0,0,0.35)",
        transition: "all .2s ease",
        userSelect: "none"
      }}
    >
      <div style={{ textAlign: "center", padding: 8 }}>
        <div
          style={{
            width: 120,
            height: 160,
            borderRadius: 10,
            background:
              "repeating-linear-gradient(135deg, #2a2a2a 0 8px, #303030 8px 16px)",
            margin: "0 auto 12px auto",
            boxShadow: "inset 0 0 16px rgba(0,0,0,.45)"
          }}
        />
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          {selected ? "Selected" : "Tap to select"}
        </div>
      </div>
    </div>
  );
}
