"use client";
import React from "react";

type Props = { name?: string; onSelect?: (n: string) => void };

export default function HeroModel({ name = "Default Hero", onSelect }: Props) {
  return (
    <div
      style={{
        width: 180,
        height: 280,
        border: "2px solid gold",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg,#222,#444)",
        color: "white",
        fontSize: 18,
        cursor: "pointer"
      }}
      onClick={() => onSelect?.(name)}
    >
      🦸 {name}
    </div>
  );
}
