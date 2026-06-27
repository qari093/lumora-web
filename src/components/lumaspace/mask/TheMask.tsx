"use client";

import { useState } from "react";
import { createMaskState, toggleMaskMode, type LumaMaskMode } from "@/src/core/lumaspace/mask/runtime";
import PublicUniverse from "./PublicUniverse";
import InnerUniverse from "./InnerUniverse";

export default function TheMask() {
  const [mode, setMode] = useState<LumaMaskMode>("public");
  const state = createMaskState(mode);

  return (
    <section data-testid="lumaspace-mask" style={{ display: "grid", gap: 14 }}>
      <button
        type="button"
        onClick={() => setMode(toggleMaskMode(mode))}
        aria-label="Toggle Public and Inner Self"
        style={{
          border: "1px solid rgba(255,255,255,.18)",
          borderRadius: 999,
          padding: "12px 18px",
          background: state.private ? "rgba(88,28,135,.34)" : "rgba(34,211,238,.14)",
          color: "white",
          backdropFilter: "blur(18px)"
        }}
      >
        The Mask — {state.label}
      </button>
      {mode === "public" ? <PublicUniverse /> : <InnerUniverse />}
    </section>
  );
}
