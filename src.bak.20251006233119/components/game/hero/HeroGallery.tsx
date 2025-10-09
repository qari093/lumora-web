"use client";
import React from "react";
import HeroModel from "./HeroModel";

const DEFAULTS = ["Astra", "Blaze", "Kenshi", "Nyx", "Ronan", "Valkyr"];

export default function HeroGallery() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "white", marginBottom: 12 }}>Hero Models</h2>
      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))"
        }}
      >
        {DEFAULTS.map((n) => (
          <HeroModel key={n} name={n} selected={selected === n} onSelect={setSelected} />
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 12,
          borderRadius: 10,
          background: "linear-gradient(145deg,#161616,#1e1e1e)",
          color: "white",
          border: "1px solid #2a2a2a"
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.85 }}>Selected Hero</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
          {selected ?? "—"}
        </div>
      </div>
    </div>
  );
}
