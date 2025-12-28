"use client";

import { useEffect, useState } from "react";

export function BrandSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0b1020",
        color: "#eaf0ff",
        display: "grid",
        placeItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 2 }}>LUMORA</div>
        <div style={{ opacity: 0.85, marginTop: 8 }}>loading…</div>
      </div>
    </div>
  );
}

export default BrandSplash;
