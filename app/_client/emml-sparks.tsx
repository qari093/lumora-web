"use client";
import React, { useEffect, useRef, useState } from "react";

type Bar = { v: number; t: number };

export default function EmmlSparks() {
  const [bars, setBars] = useState<Bar[]>(
    Array.from({ length: 6 }, () => ({ v: 0, t: 0 }))
  );
  const esRef = useRef<EventSource | null>(null);
  const rafRef = useRef<number | null>(null);

  // decay animation
  useEffect(() => {
    const tick = () => {
      setBars((prev) =>
        prev.map((b) => {
          // exponential decay
          const v = Math.max(0, b.v * 0.92 - 0.01);
          return { ...b, v };
        })
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // SSE stream hookup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = "/api/emotion/stream";
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = () => {
      // bump a random bar
      setBars((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const next = prev.slice();
        next[i] = { v: 1, t: Date.now() };
        return next;
      });
    };
    es.onerror = () => {
      // attempt to reconnect by recreating ES
      try { es.close(); } catch {}
      setTimeout(() => {
        if (esRef.current === es) {
          esRef.current = new EventSource(url);
        }
      }, 1500);
    };
    return () => { try { es.close(); } catch {} };
  }, []);

  // UI
  return (
    <div
      aria-label="EMML live sparks"
      style={{
        position: "fixed",
        top: 10,
        right: 12,
        zIndex: 999,
        display: "flex",
        gap: 6,
        padding: "6px 8px",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 10,
      }}
    >
      {bars.map((b, idx) => (
        <div key={idx} style={{ width: 8, height: 28, borderRadius: 3, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", background: "rgba(0,0,0,0.05)" }}>
          <div
            style={{
              width: "100%",
              height: `${Math.max(0, Math.min(100, Math.round(b.v * 100)))}%`,
              transform: "translateY(0)",
              transition: "height 90ms linear",
              willChange: "height",
              background:
                "linear-gradient(180deg, rgba(80,120,255,0.95), rgba(120,200,255,0.85))",
            }}
          />
        </div>
      ))}
    </div>
  );
}
