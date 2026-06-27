"use client";

import { getIdentityModeLabel, type LumaProfileMode } from "@/src/core/lumaspace/identity/runtime";

export default function CinematicProfile({
  mode = "aura"
}: {
  mode?: LumaProfileMode;
}) {
  return (
    <div
      data-testid="lumaspace-cinematic-profile"
      style={{
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,.14)",
        background: "linear-gradient(135deg, rgba(34,211,238,.14), rgba(168,85,247,.12), rgba(0,0,0,.42))",
        boxShadow: "0 18px 60px rgba(0,0,0,.42)",
        padding: 18,
        color: "white",
        backdropFilter: "blur(20px)"
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: ".22em", color: "rgba(103,232,249,.78)" }}>
        {getIdentityModeLabel(mode).toUpperCase()}
      </div>
      <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800 }}>
        Your identity breathes here.
      </div>
    </div>
  );
}
