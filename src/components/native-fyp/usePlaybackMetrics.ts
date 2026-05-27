"use client";

import { useEffect, useRef } from "react";

export function usePlaybackMetrics(activeId?: string, ready?: boolean) {
  const start = useRef<number>(Date.now());

  useEffect(() => {
    start.current = Date.now();
  }, [activeId]);

  useEffect(() => {
    if (!activeId || !ready) return;

    const ms = Date.now() - start.current;

    void fetch("/api/fyp/native-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "playback_ready",
        id: activeId,
        ms,
      }),
    }).catch(() => {});
  }, [activeId, ready]);
}
