// FILE: app/(demo)/gestures-demo/page.tsx
// Demo page to validate mobile gestures + edge drawers wiring

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
    <main style={wrap}>
      <h1 style={h1}>Gestures Demo</h1>
      <p style={p}>
        • Swipe <b>from left edge →</b> open left drawer<br />
        • Swipe <b>from right edge ←</b> open right drawer<br />
        • <b>Pull down</b> near top to reload (or emit event)
      </p>

      <section style={grid}>
        <button style={btn} onClick={() => dispatchEvent(new CustomEvent("lumora:open-left-drawer"))}>
          Open Left Drawer
        </button>
        <button style={btn} onClick={() => dispatchEvent(new CustomEvent("lumora:open-right-drawer"))}>
          Open Right Drawer
        </button>
        <button
          style={btn}
          onClick={() => dispatchEvent(new CustomEvent("lumora:pull-down", { detail: { via: "manual" } }))}
        >
          Emit Pull-Down Event
        </button>
        <button style={btn} onClick={() => history.back()}>Swipe Left ≈ Back (Test)</button>
        <button style={btn} onClick={() => history.forward()}>Swipe Right ≈ Forward (Test)</button>
      </section>

      <section style={panel}>
        <div style={row}><span style={label}>Last Event:</span><span style={val}>{lastEvent}</span></div>
        <div style={row}><span style={label}>Pull-down Count:</span><span style={val}>{pulldownCount}</span></div>
      </section>

      <p style={hint}>
        Tip: On device, start your swipe within ~28px of screen edge to trigger drawers. Otherwise it will navigate.
      </p>
    </main>
  );
}

// ── inline styles (keeps demo isolated) ────────────────────────────────────────
const wrap: React.CSSProperties = {
  padding: "18px",
  display: "grid",
  gap: 16,
  alignContent: "start",
};
const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, letterSpacing: 0.2 };
const p: React.CSSProperties = { opacity: 0.9, lineHeight: 1.4 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 };
const btn: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  textAlign: "center",
};
const panel: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  display: "grid",
  gap: 8,
};
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 10 };
const label: React.CSSProperties = { opacity: 0.8 };
const val: React.CSSProperties = { fontWeight: 700 };
const hint: React.CSSProperties = { opacity: 0.7, fontSize: 13 };