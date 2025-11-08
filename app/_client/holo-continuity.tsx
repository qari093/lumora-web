"use client";
import React, { useEffect, useRef, useState } from "react";

export default function HoloContinuity() {
  const [on, setOn] = useState(true);
  const keyRef = useRef<(e: KeyboardEvent) => void>();

  useEffect(() => {
    const id = "holo-cont-style";
    if (!document.getElementById(id)) {
      const st = document.createElement("style");
      st.id = id;
      st.textContent = [
        ":root{ --holo-strength: 0.18; }",
        "@media (prefers-reduced-motion: reduce){ :root{ --holo-strength: 0.10; } }",
        ".holo-continuity-overlay{",
        "  position:fixed; inset:0; pointer-events:none; z-index:2147482000;",
        "  background:",
        "    radial-gradient(60vw 60vh at 20% 20%, rgba(0,200,255,.25), transparent 60%),",
        "    radial-gradient(50vw 50vh at 80% 80%, rgba(255,0,200,.20), transparent 60%),",
        "    radial-gradient(40vw 40vh at 50% 10%, rgba(0,255,160,.18), transparent 60%);",
        "  mix-blend-mode:screen; opacity:var(--holo-strength); transition:opacity .35s ease;",
        "  animation:holoFloat 10s ease-in-out infinite;",
        "}",
        ".holo-continuity-off{ opacity:0; }",
        "@keyframes holoFloat{",
        "  0%{filter:hue-rotate(0deg) saturate(105%)}",
        "  50%{filter:hue-rotate(10deg) saturate(120%)}",
        "  100%{filter:hue-rotate(0deg) saturate(105%)}",
        "}",
        ".holo-chip{",
        "  position:fixed; left:12px; bottom:46px; z-index:2147483000;",
        "  background:rgba(15,15,20,.72); backdrop-filter:blur(10px);",
        "  padding:8px 10px; border-radius:10px; font:600 12px/1.2 system-ui;",
        "  color:#fff; box-shadow:0 6px 20px rgba(0,0,0,.28);",
        "}"
      ].join("\n");
      document.head.appendChild(st);
    }
  }, []);

  useEffect(() => {
    keyRef.current = (e: KeyboardEvent) => {
      if ((e.key || "").toLowerCase() === "h") setOn((v) => !v);
    };
    const handler = (e: KeyboardEvent) => keyRef.current && keyRef.current(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div className={"holo-continuity-overlay" + (on ? "" : " holo-continuity-off")} />
      <div className="holo-chip" title="Holo Continuity Shader — press H to toggle">
        Holo Shader: <b>{on ? "on" : "off"}</b> — press <kbd>H</kbd>
      </div>
    </>
  );
}
