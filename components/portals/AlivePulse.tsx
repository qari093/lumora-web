"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  portal: string;
  intervalMs?: number;
};

/**
 * AlivePulse: minimal, safe "alive" surface.
 * - No network calls
 * - No external deps
 * - Provides visible state change for "this is not static UI" perception
 */
export default function AlivePulse({ portal, intervalMs }: Props) {
  const ms = typeof intervalMs === "number" && intervalMs >= 250 ? intervalMs : 1500;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => (x + 1) % 1_000_000), ms);
    return () => clearInterval(t);
  }, [ms]);

  const stamp = useMemo(() => {
    // stable but changing; avoid locale surprises in tests
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }, []);

  return (
    <div
      data-lumora-alive="1"
      data-portal={portal}
      className="text-xs opacity-70 select-none"
      aria-label={`${portal} live pulse`}
    >
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60" />
        <span>{portal} live</span>
        <span className="opacity-60">·</span>
        <span className="opacity-60">updated {stamp}</span>
      </span>
    </div>
  );
}
