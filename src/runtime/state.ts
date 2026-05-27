"use client";

import { useEffect, useRef, useState } from "react";

export function useRuntimeState() {
  const [state, setState] = useState<any>(null);
  const versionRef = useRef<number>(-1);

  useEffect(() => {
    let mounted = true;
    let inFlight = false;

    async function load() {
      if (inFlight) return;
      inFlight = true;

      try {
        const res = await fetch("/api/runtime/state", { cache: "no-store" });
        const json = await res.json();

        if (!mounted || !json?.ok) return;

        if (json.version !== versionRef.current) {
          versionRef.current = json.version;
          setState(json.state);
        }
      } catch {
        if (mounted) setState(null);
      } finally {
        inFlight = false;
      }
    }

    load();
    const timer = window.setInterval(load, 1000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return state;
}
