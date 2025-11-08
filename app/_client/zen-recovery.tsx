"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * Zen Recovery Mode
 * - Shows a small chip when the app detects error/offline recovery conditions.
 * - Press Z (or call: window.dispatchEvent(new CustomEvent("lumora:zen-recover")))
 *   to run a safe resync: flush queues, retry pending orders, clear crash markers.
 */
type RecState = {
  active: boolean;
  hint: string;
  last: number;
};

function chipStyle(active: boolean): React.CSSProperties {
  return {
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 2147483010,
    background: active ? "rgba(180,40,160,.82)" : "rgba(60,60,70,.72)",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 12,
    font: "600 12px/1.2 system-ui",
    boxShadow: "0 10px 28px rgba(0,0,0,.45)",
    backdropFilter: "blur(10px)",
    display: "flex",
    gap: 8,
    alignItems: "center",
    pointerEvents: "auto",
  };
}

export default function ZenRecovery() {
  const [st, setSt] = useState<RecState>({ active: false, hint: "ready", last: Date.now() });
  const keyRef = useRef<(e: KeyboardEvent)=>void>();

  // Simple crash/dirty markers we may set elsewhere
  const CRASH_KEY = "lumora:last_crash";
  const DIRTY_KEY = "lumora:dirty_state";

  // Broadcast helpers
  function emit(name: string, detail?: any) {
    try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch {}
  }

  function hasDirtyState() {
    try {
      return !!(localStorage.getItem(CRASH_KEY) || localStorage.getItem(DIRTY_KEY));
    } catch { return false; }
  }

  async function flushQueues() {
    // If metrics queue provides a flush hook
    try {
      const flush = (window as any).__lumora_metrics_flush;
      if (typeof flush === "function") await flush();
    } catch {}
    emit("lumora:metrics:flush");
    emit("lumora:orders:retry");
    emit("lumora:sync");
  }

  function clearMarkers() {
    try {
      localStorage.removeItem(CRASH_KEY);
      localStorage.removeItem(DIRTY_KEY);
    } catch {}
  }

  async function runRecovery() {
    setSt(v => ({ ...v, active: true, hint: "resyncing…", last: Date.now() }));
    try {
      await flushQueues();
      clearMarkers();
      setTimeout(() => {
        setSt(v => ({ ...v, active: false, hint: "ok", last: Date.now() }));
      }, 1200);
    } catch {
      setSt(v => ({ ...v, active: true, hint: "retry failed — try again", last: Date.now() }));
    }
  }

  useEffect(() => {
    // auto-arm if we detect dirty state
    if (hasDirtyState()) setSt(v => ({ ...v, active: true, hint: "recovery ready", last: Date.now() }));

    // keyboard: press Z
    keyRef.current = (e: KeyboardEvent) => {
      if ((e.key || "").toLowerCase() === "z") runRecovery();
    };
    const handler = (e: KeyboardEvent) => keyRef.current && keyRef.current(e);
    window.addEventListener("keydown", handler);

    // programmatic trigger
    const trigger = () => runRecovery();
    window.addEventListener("lumora:zen-recover", trigger as any);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("lumora:zen-recover", trigger as any);
    };
  }, []);

  return (
    <div style={chipStyle(st.active)} title="Zen Recovery Mode (press Z)">
      <span>Zen Recovery</span>
      <span style={{ opacity:.85 }}>• {st.hint}</span>
      <button
        onClick={runRecovery}
        style={{ marginLeft:8, background:"#09f", color:"#fff", border:"none", borderRadius:8, padding:"4px 8px", cursor:"pointer" }}
      >
        Resync
      </button>
      <button
        onClick={clearMarkers}
        style={{ background:"transparent", color:"#fff", border:"1px solid rgba(255,255,255,.35)", borderRadius:8, padding:"4px 8px", marginLeft:6, cursor:"pointer" }}
      >
        Clear
      </button>
    </div>
  );
}
