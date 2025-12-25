"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getOrCreateTesterId } from "@/app/_lib/testers/testerId";

type Evt = {
  ts: string;
  type: "route_view" | "route_time";
  testerId: string;
  path: string;
  ms?: number;
};

async function postEvents(events: Evt[]) {
  try {
    await fetch("/api/telemetry/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ events }),
      keepalive: true,
    });
  } catch {}
}

export default function TelemetryTracker() {
  const pathname = usePathname() || "/";
  const startRef = useRef<number>(Date.now());
  const lastPathRef = useRef<string>(pathname);

  useEffect(() => {
    const testerId = getOrCreateTesterId();
    const ts = new Date().toISOString();

    const prev = lastPathRef.current;
    if (prev && prev !== pathname) {
      const ms = Math.max(0, Date.now() - startRef.current);
      postEvents([{ ts, type: "route_time", testerId, path: prev, ms }]);
    }

    startRef.current = Date.now();
    lastPathRef.current = pathname;
    postEvents([{ ts, type: "route_view", testerId, path: pathname }]);
  }, [pathname]);

  useEffect(() => {
    const testerId = getOrCreateTesterId();
    const flush = () => {
      const ts = new Date().toISOString();
      const path = lastPathRef.current || "/";
      const ms = Math.max(0, Date.now() - startRef.current);
      postEvents([{ ts, type: "route_time", testerId, path, ms }]);
      startRef.current = Date.now();
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}
