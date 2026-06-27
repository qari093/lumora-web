"use client";

import type { EchoMemory } from "@/src/core/lumaspace/echo/runtime";

export default function EchoPlayer({ echo }: { echo: EchoMemory }) {
  return (
    <div
      data-testid="lumaspace-echo-player"
      style={{
        borderRadius: 24,
        border: "1px solid rgba(103,232,249,.22)",
        background: "rgba(255,255,255,.055)",
        color: "white",
        padding: 16
      }}
    >
      <strong>Echo</strong>
      <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.68)" }}>{echo.transcript}</p>
    </div>
  );
}
