"use client";

import { useEffect, useRef } from "react";

type TrackBody = {
  type?: string;
  path?: string;
  meta?: Record<string, unknown>;
};

async function safePost(url: string, body: unknown) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // swallow in client to avoid breaking rendering
  }
}

export default function ShareTracker() {
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const ts = Date.now();

    // 1) Share open tracking (primary)
    void safePost("/api/share/track", { ts, via: "share_page" });

    // 2) General telemetry (non-blocking)
    const telemetry: TrackBody = { type: "route_view", path: "/share", meta: { via: "ShareTracker", ts } };
    void safePost("/api/telemetry/track", telemetry);
  }, []);

  return null;
}
