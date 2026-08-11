"use client";

import React from "react";

function readBoolEnv(name: string, defaultValue: boolean) {
  const v = (process.env[name] ?? "").trim();
  if (!v) return defaultValue;
  if (v === "0" || v.toLowerCase() === "false" || v.toLowerCase() === "off") return false;
  if (v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "on") return true;
  return defaultValue;
}

export default function LumenDock() {
  // Free in test phase (later: gate by Zencoin ownership / wallet binding)
  const enabled = readBoolEnv("NEXT_PUBLIC_LUMEN_DOCK_ENABLED", true);
  if (!enabled) return null;

  const freeBadge = readBoolEnv("NEXT_PUBLIC_LUMEN_FREE_TEST", true);

  return (
    <div className="lumenDockOverlay" style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999, pointerEvents: "none" }}>
      <div className="lumenDockInner" style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", gap: 10, width: "fit-content", maxWidth: "calc(100vw - 32px)" }}>
    <div className="lumenDockRoot"
      aria-label="Lumen quick access"
      style={{
      width: "fit-content",
      maxWidth: "calc(100vw - 32px)",
      right: 16,
      bottom: 16,
      left: undefined,
      top: undefined,

        position: "fixed",
        right: 14,
        bottom: 14,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "auto",
      }}
    >
      <a
        href="/lumen"
        style={{
          textDecoration: "none",
          borderRadius: 999,
          padding: "12px 14px",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(30,30,34,0.42)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          color: "rgba(255,255,255,0.92)",
          fontWeight: 750,
          letterSpacing: 0.2,
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: 280,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 10,
            height: 10,
            borderRadius: 99,
            background: "linear-gradient(180deg, rgba(0,255,208,0.9), rgba(120,80,255,0.9))",
            boxShadow: "0 0 18px rgba(0,255,208,0.35)",
            flex: "0 0 auto",
          }}
        />
        <span style={{ lineHeight: 1.1 }}>
          Lumen
          <span style={{ display: "block", fontSize: 12, fontWeight: 600, opacity: 0.82 }}>
            Companion / guidance
          </span>
        </span>
        {freeBadge ? (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              opacity: 0.92,
            }}
            title="Free during test phase"
          >
            FREE
          </span>
        ) : null}
      </a>

      <a
        href="/lumexa"
        style={{
          textDecoration: "none",
          borderRadius: 999,
          padding: "10px 14px",
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(18,18,22,0.32)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          color: "rgba(255,255,255,0.88)",
          fontWeight: 720,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span aria-hidden="true" style={{ opacity: 0.9 }}>↳</span>
        <span style={{ fontSize: 13 }}>Lumexa</span>
        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.72 }}>AI tools</span>
      </a>
    </div>
      </div>
    </div>
  );
}
