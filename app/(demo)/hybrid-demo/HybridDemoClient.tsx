"use client";

/* FILE: HybridDemoClient.tsx
   Client-only wrapper for the hybrid demo page to avoid build-time prerender crashes.
   This component may import other demo UI without impacting SSG. */

import React from "react";

// Import the previous page implementation lazily to avoid evaluation during server build.
const Impl = React.lazy(async () => {
  const mod = require("./page.impl");
  return { default: mod.default || (() => null) };
});

export default function HybridDemoClient() {
  return (
    <React.Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <Impl />
    </React.Suspense>
  );
}
