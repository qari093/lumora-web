// FILE: app/_client/gesture-bridge.ts
// Gesture Event Bridge — connects gesture events to Lumora runtime telemetry and logs for debugging
// Features:
//  • Listens to gesture CustomEvents (pull-down, open-left/right-drawer)
//  • Logs to console + dispatches internal telemetry signal
//  • Can be extended later for Emotion Engine or analytics ingestion

"use client";

import { useEffect } from "react";

export default function GestureBridge() {
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const name = e.type;
      const detail = (e as CustomEvent).detail || {};
      const ts = new Date().toISOString();

      console.debug(`[GestureBridge] ${name}`, { ...detail, ts });

      // internal telemetry hook
      window.dispatchEvent(
        new CustomEvent("lumora:telemetry", {
          detail: { source: "gesture", type: name, meta: detail, ts },
        })
      );
    };

    const events = ["lumora:pull-down", "lumora:open-left-drawer", "lumora:open-right-drawer"];
    for (const ev of events) window.addEventListener(ev, handleEvent as EventListener);

    return () => {
      for (const ev of events) window.removeEventListener(ev, handleEvent as EventListener);
    };
  }, []);

  return null;
}