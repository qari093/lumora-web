"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type LumoraSplashProps = {
  fadeOutMs?: number;
  onDone?: () => void;
};

/**
 * LumoraSplash — lightweight, boot-safe splash overlay.
 * - Plays a simple reveal + glow pulse
 * - Fades out, then calls onDone()
 * - Respects `fadeOutMs` from SplashGate
 *
 * NOTE: Visual styling is intentionally minimal and relies on CSS variables.
 */
export default function LumoraSplash(props: LumoraSplashProps) {
  const fadeOutMs = typeof props.fadeOutMs === "number" ? props.fadeOutMs : 220;

  const [phase, setPhase] = useState<"in" | "out">("in");
  const doneCalled = useRef(false);

  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  const done = () => {
    if (doneCalled.current) return;
    doneCalled.current = true;
    try {
      props.onDone?.();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (prefersReduced) {
      // Instant exit for reduced motion (gate should already prevent render, but keep safe)
      done();
      return;
    }

    // Start fade-out when SplashGate hides (it unmounts), but also provide a local fade-out path
    // in case the component is used standalone.
    const t = window.setTimeout(() => setPhase("out"), 1050);
    return () => window.clearTimeout(t);
  }, [prefersReduced]);

  useEffect(() => {
    if (phase !== "out") return;

    const t = window.setTimeout(() => done(), Math.max(0, fadeOutMs));
    return () => window.clearTimeout(t);
  }, [phase, fadeOutMs]);

  return (
    <div
      aria-hidden="true"
      data-fadeout-ms={fadeOutMs}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(80% 60% at 50% 40%, rgba(80,180,255,0.16), rgba(0,0,0,0.92) 70%)",
        transition: `opacity ${fadeOutMs}ms ease`,
        opacity: phase === "out" ? 0 : 1,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: 28,
          background:
            "radial-gradient(60% 60% at 50% 35%, rgba(140,220,255,0.30), rgba(20,40,60,0.35) 65%, rgba(0,0,0,0) 100%)",
          boxShadow:
            "0 0 0 1px rgba(120,210,255,0.22), 0 18px 55px rgba(0,0,0,0.55), 0 0 36px rgba(70,190,255,0.16)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "grid",
          placeItems: "center",
          transform: phase === "out" ? "scale(0.995)" : "scale(1)",
          transition: "transform 260ms ease",
        }}
      >
        {/* Minimal blade-like glyph (SVG) — replace with your finalized logo if desired */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: "drop-shadow(0 0 10px rgba(80,190,255,0.35))",
          }}
        >
          <path
            d="M69 10 C76 30, 88 45, 102 55 C88 68, 76 83, 69 110 C60 85, 44 70, 18 60 C44 50, 60 35, 69 10 Z"
            fill="rgba(120,220,255,0.82)"
          />
          <path
            d="M69 16 C74 32, 83 44, 94 52 C83 63, 74 76, 69 104 C62 78, 49 65, 28 58 C49 50, 62 37, 69 16 Z"
            fill="rgba(10,20,30,0.55)"
          />
        </svg>
      </div>
    </div>
  );
}
