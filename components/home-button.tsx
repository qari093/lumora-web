// components/home-button.tsx
"use client";
import React from "react";

export default function HomeButton() {
  return (
    <>
      <button
        className="home-btn"
        aria-label="Open Home Overlay"
        onClick={() => { dispatchEvent(new CustomEvent("lumora:overlay-open")); try{(navigator as any).vibrate?.(8);}catch{} }}
      >
        <span className="orb">⌂</span>
      </button>

      <style jsx>{`
        .home-btn {
          position: fixed; z-index: 1001;
          bottom: calc(14px + env(safe-area-inset-bottom));
          left: 50%; transform: translateX(-50%);
          width: clamp(64px, 9.5vw, 74px); height: clamp(64px, 9.5vw, 74px);
          border-radius: 50%; border: none; cursor: pointer;
          background: radial-gradient(ellipse at 30% 30%, #fff, #ececec);
          box-shadow: 0 18px 48px rgba(0,0,0,0.22), inset 0 0 24px rgba(255,255,255,0.8);
          transition: transform 140ms ease, box-shadow 140ms ease; will-change: transform;
          -webkit-tap-highlight-color: transparent;
        }
        .home-btn:hover { transform: translateX(-50%) translateY(-2px) scale(1.03); }
        .home-btn:active { transform: translateX(-50%) translateY(1px) scale(.98); }
        .orb { display: grid; place-items: center; width: 100%; height: 100%; font-size: clamp(22px, 3.4vw, 26px); font-weight: 900; color: #111; text-shadow: 0 1px 0 rgba(255,255,255,0.6); user-select: none; }
        :global(html.dark) .home-btn { background: radial-gradient(ellipse at 30% 30%, #1f1f24, #0f0f12); box-shadow: 0 20px 56px rgba(0,0,0,0.55), inset 0 0 26px rgba(255,255,255,0.05); }
        :global(html.dark) .orb { color: #f0f2f6; }
      `}</style>
    </>
  );
}
