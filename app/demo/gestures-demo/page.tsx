// FILE: app/demo/gestures-demo/page.tsx
// Rich demo to validate gestures + drawers on desktop/mobile (cleaned + improved)

"use client";

import { useEffect, useState } from "react";

export default function GesturesDemoPage() {
  const [pulldownCount, setPulldownCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<string>("—");

  useEffect(() => {
    const onPull = () => {
      setPulldownCount((n) => n + 1);
      setLastEvent("pull-down");
    };
    const onLeft = () => setLastEvent("open-left-drawer");
    const onRight = () => setLastEvent("open-right-drawer");

    addEventListener("lumora:pull-down", onPull as EventListener);
    addEventListener("lumora:open-left-drawer", onLeft as EventListener);
    addEventListener("lumora:open-right-drawer", onRight as EventListener);

    return () => {
      removeEventListener("lumora:pull-down", onPull as EventListener);
      removeEventListener("lumora:open-left-drawer", onLeft as EventListener);
      removeEventListener("lumora:open-right-drawer", onRight as EventListener);
    };
  }, []);

  return (
    <main style={wrap} role="main" aria-label="Gestures Demo">
      <h1 style={h1}>Gestures Demo</h1>

      <ul style={list} aria-label="How to test">
        <li>
          Swipe <b>from left edge →</b> open left drawer
        </li>
        <li>
          Swipe <b>from right edge ←</b> open right drawer
        </li>
        <li>
          <b>Pull down</b> near top to reload (or emit event)
        </li>
      </ul>

      <section style={grid} aria-label="Manual triggers">
        <button
          style={btn}
          onClick={() => dispatchEvent(new CustomEvent("lumora:open-left-drawer"))}
          aria-label="Open left drawer"
        >
          Open Left Drawer
        </button>
        <button
          style={btn}
          onClick={() => dispatchEvent(new CustomEvent("lumora:open-right-drawer"))}
          aria-label="Open right drawer"
        >
          Open Right Drawer
        </button>
        <button
          style={btn}
          onClick={() =>
            dispatchEvent(new CustomEvent("lumora:pull-down", { detail: { via: "manual" } }))
          }
          aria-label="Emit pull-down event"
        >
          Emit Pull-Down Event
        </button>
        <button style={btn} onClick={() => history.back()} aria-label="Back">
          Swipe Left ≈ Back (Test)
        </button>
        <button style={btn} onClick={() => history.forward()} aria-label="Forward">
          Swipe Right ≈ Forward (Test)
        </button>
      </section>

      <section style={panel} aria-live="polite" aria-label="Live status">
        <div style={row}>
          <span style={label}>Last Event:</span>
          <span style={val}>{lastEvent}</span>
        </div>
        <div style={row}>
          <span style={label}>Pull-down Count:</span>
          <span style={val}>{pulldownCount}</span>
        </div>
      </section>

      <p style={hint}>
        Tip: On device, start your swipe within ~28px of screen edge to trigger drawers.
        Otherwise it will navigate.
      </p>
    </main>
  );
}

/* ── inline styles (isolated) ─────────────────────────────────────────────── */
const wrap: React.CSSProperties = {
  padding: 24,
  color: "#fff",
  background: "#0b0b0c",
  minHeight: "100dvh",
  display: "grid",
  gap: 18,
  alignContent: "start",
};
const h1: React.CSSProperties = { fontSize: 22, fontWeight: 800, letterSpacing: 0.2 };
const list: React.CSSProperties = { marginLeft: 18, lineHeight: 1.5, opacity: 0.95 };
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
  gap: 12,
};
const btn: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  textAlign: "center",
  cursor: "pointer",
};
const panel: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  display: "grid",
  gap: 10,
};
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 10 };
const label: React.CSSProperties = { opacity: 0.85 };
const val: React.CSSProperties = { fontWeight: 800 };
const hint: React.CSSProperties = { opacity: 0.7, fontSize: 13 };