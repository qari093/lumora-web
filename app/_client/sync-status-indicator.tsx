"use client";
import React, { useEffect, useRef, useState } from "react";

type State = {
  online: boolean;
  lastChange: number;
  queued?: number;
};

function chipStyle(online: boolean): React.CSSProperties {
  return {
    position: "fixed",
    left: 12,
    bottom: 60,
    zIndex: 2147483000,
    background: online ? "rgba(15,120,40,.78)" : "rgba(140,60,20,.78)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 10,
    font: "600 12px/1.2 system-ui",
    boxShadow: "0 6px 22px rgba(0,0,0,.35)",
    display: "flex",
    gap: 8,
    alignItems: "center",
  };
}

export default function SyncStatusIndicator() {
  const [s, setS] = useState<State>({
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
    lastChange: Date.now(),
    queued: 0,
  });
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const on = () => setS((v) => ({ ...v, online: true, lastChange: Date.now() }));
    const off = () => setS((v) => ({ ...v, online: false, lastChange: Date.now() }));
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    // listen to our metrics queue length if present
    const updateFromQueue = () => {
      try {
        const n = (window as any).__lumora_metrics_queue_len ?? 0;
        setS((v) => ({ ...v, queued: n }));
      } catch {}
    };
    tickRef.current = window.setInterval(updateFromQueue, 1000);
    updateFromQueue();

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  const agoMs = Date.now() - (s.lastChange || Date.now());
  const secs = Math.max(0, Math.round(agoMs / 1000));
  const label = s.online ? "Online" : "Offline";
  const q = typeof s.queued === "number" ? ` • queued ${s.queued}` : "";

  return (
    <div style={chipStyle(s.online)} title="Sync Status Indicator">
      <span>{label}</span>
      <span style={{ opacity: .8 }}>• {secs}s</span>
      <span style={{ opacity: .9 }}>{q}</span>
    </div>
  );
}
