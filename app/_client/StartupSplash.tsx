"use client";

import React, { useEffect, useMemo, useState } from "react";

const KEY = "lumora_splash_seen_v1";

function canUseStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export default function StartupSplash() {
  const [show, setShow] = useState(false);

  const allow = useMemo(() => {
    if (typeof window === "undefined") return false;
    return true;
  }, []);

  useEffect(() => {
    if (!allow) return;

    const seen = (() => {
      if (!canUseStorage()) return false;
      try {
        return window.sessionStorage.getItem(KEY) === "1";
      } catch {
        return false;
      }
    })();

    if (seen) return;

    setShow(true);

    const t1 = window.setTimeout(() => {
      setShow(false);
      try {
        window.sessionStorage.setItem(KEY, "1");
      } catch {
        // ignore
      }
    }, 950);

    return () => window.clearTimeout(t1);
  }, [allow]);

  if (!show) return null;

  return (
    <div
      aria-label="Lumora startup splash"
      data-splash="STEP133_SPLASH_OVERLAY"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(1200px 800px at 30% 30%, rgba(120,140,255,0.22), transparent 60%), radial-gradient(1000px 700px at 70% 70%, rgba(90,240,220,0.18), transparent 55%), #070A12",
        color: "rgba(255,255,255,0.92)",
        transition: "opacity 220ms ease",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 14,
          justifyItems: "center",
          padding: 22,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.06) inset",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maxWidth: 440,
          width: "min(92vw, 440px)",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,255,255,0.14)",
            background:
              "linear-gradient(135deg, rgba(130,150,255,0.35), rgba(90,240,220,0.20))",
            boxShadow:
              "0 18px 50px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.08) inset",
            fontWeight: 900,
            letterSpacing: 0.5,
          }}
        >
          L
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>
            Lumora
          </div>
          <div style={{ fontSize: 12, opacity: 0.78, marginTop: 4 }}>
            Loading portals…
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            width: "100%",
            height: 6,
            borderRadius: 999,
            overflow: "hidden",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              transformOrigin: "0% 50%",
              animation: "lumora_splash_bar 950ms linear forwards",
              background:
                "linear-gradient(90deg, rgba(130,150,255,0.85), rgba(90,240,220,0.85))",
            }}
          />
        </div>

        <style>{`
          @keyframes lumora_splash_bar {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-splash="STEP133_SPLASH_OVERLAY"] div { animation: none !important; transition: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
