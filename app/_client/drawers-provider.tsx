// FILE: app/_client/drawers-provider.tsx
// Optimized DrawersProvider — ensures safe mount, avoids double render and supports deferred hydration

"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// Lazy import DrawersHost to prevent hydration mismatch on SSR
const DrawersHost = dynamic(() => import("./drawers-host"), { ssr: false });

export default function DrawersProvider() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // slight delay to avoid blocking main thread during hydration
    const timer = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <Suspense fallback={null}>
      {ready && <DrawersHost />}
    </Suspense>
  );
}