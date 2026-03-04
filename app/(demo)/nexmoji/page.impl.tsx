"use client";

/* FILE: app/(demo)/nexmoji/page.impl.tsx
   Client-only implementation for Nexmoji demo to avoid prerender crashes from non-serializable / browser-only deps. */

import React from "react";

export default function NexmojiImpl() {
  // Render the original page content via dynamic import at runtime if it exists,
  // else provide a minimal safe fallback.
  // Note: The server wrapper imports this file directly; this component stays client-only.
  try {
    const Mod = require("./page.original");
    const Comp = Mod?.default;
    if (typeof Comp === "function") return <Comp />;
  } catch {
    // ignore and fallback
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Nexmoji</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Demo is client-only in production builds to avoid prerender failures.
      </p>
    </div>
  );
}
