// FILE: app/_client/gestures-provider.tsx
// Global provider to attach GesturesMount inside layout tree once

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// dynamically load mount only on client
const GesturesMount = dynamic(() => import("./gestures-mount"), { ssr: false });

export default function GesturesProvider() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // small delay to avoid hydration conflicts
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  return ready ? <GesturesMount /> : null;
}