"use client";
import React from "react";

const STORAGE_KEY = "lumora_battery_saver";

export default function BatterySaverToggle() {
  const [enabled, setEnabled] = React.useState<boolean>(false);

  // Load saved state on mount
  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setEnabled(saved === "1");
  }, []);

  // Broadcast changes so players can react (e.g., slow/pausing logic)
  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("lumora:battery", { detail: { enabled: next } })
        );
      } catch {}
      return next;
    });
  };

  return (
    <button
      aria-label="Battery saver"
      onClick={toggle}
      style={{
        position: "fixed",
        bottom: "12px",
        right: "12px",
        padding: "6px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.18)",
        background: enabled ? "rgba(40,180,110,0.25)" : "rgba(255,255,255,0.08)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: enabled
          ? "0 0 14px rgba(60,200,130,0.35), inset 0 0 10px rgba(60,200,130,0.25)"
          : "0 0 10px rgba(0,0,0,0.2), inset 0 0 8px rgba(255,255,255,0.06)",
        cursor: "pointer",
        zIndex: 10000,
      }}
    >
      Battery: {enabled ? "ON" : "OFF"}
    </button>
  );
}
