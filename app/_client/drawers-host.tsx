// FILE: app/_client/drawers-host.tsx
// Edge drawers (left/right) that respond to global events from GesturesMount:
//  - dispatchEvent(new CustomEvent("lumora:open-left-drawer"))
//  - dispatchEvent(new CustomEvent("lumora:open-right-drawer"))
// Includes swipe-to-close & ESC key handling.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Side = "left" | "right";

export default function DrawersHost() {
  const [open, setOpen] = useState<Side | null>(null);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const openLeft = () => setOpen("left");
    const openRight = () => setOpen("right");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    addEventListener("lumora:open-left-drawer", openLeft as EventListener);
    addEventListener("lumora:open-right-drawer", openRight as EventListener);
    addEventListener("keydown", onKey);

    return () => {
      removeEventListener("lumora:open-left-drawer", openLeft as EventListener);
      removeEventListener("lumora:open-right-drawer", openRight as EventListener);
      removeEventListener("keydown", onKey);
    };
  }, [close]);

  // Basic swipe-to-close when panel is open
  useEffect(() => {
    if (!open) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (!t) return;
      startX.current = t.clientX;
      deltaX.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (!t) return;
      deltaX.current = t.clientX - startX.current;
      // prevent background scroll while interacting with drawer
      if (Math.abs(deltaX.current) > 8) e.preventDefault();
    };

    const onTouchEnd = () => {
      // If left drawer and swipe left enough, or right drawer and swipe right enough → close
      if (open === "left" && deltaX.current < -64) close();
      if (open === "right" && deltaX.current > 64) close();
      startX.current = 0;
      deltaX.current = 0;
    };

    const opts: AddEventListenerOptions = { passive: false };
    addEventListener("touchstart", onTouchStart, opts);
    addEventListener("touchmove", onTouchMove, opts);
    addEventListener("touchend", onTouchEnd, opts);
    return () => {
      removeEventListener("touchstart", onTouchStart, opts as any);
      removeEventListener("touchmove", onTouchMove, opts as any);
      removeEventListener("touchend", onTouchEnd, opts as any);
    };
  }, [open, close]);

  return (
    <>
      {/* Scrim */}
      <div
        role="button"
        aria-label="Close drawer"
        onClick={close}
        className={`lum-scrim ${open ? "show" : ""}`}
      />
      {/* Left drawer */}
      <aside className={`lum-drawer left ${open === "left" ? "open" : ""}`}>
        <header className="lum-drawer-header">
          <strong>Menu</strong>
          <button className="lum-btn" onClick={close} aria-label="Close">✕</button>
        </header>
        <nav className="lum-drawer-body">
          <a href="/me">Profile</a>
          <a href="/wallet">Wallet</a>
          <a href="/creator">Creator</a>
          <a href="/shop">Shop</a>
        </nav>
      </aside>
      {/* Right drawer */}
      <aside className={`lum-drawer right ${open === "right" ? "open" : ""}`}>
        <header className="lum-drawer-header">
          <strong>Quick Actions</strong>
          <button className="lum-btn" onClick={close} aria-label="Close">✕</button>
        </header>
        <div className="lum-drawer-body">
          <button className="lum-chip" onClick={() => location.assign("/search")}>Search</button>
          <button className="lum-chip" onClick={() => location.assign("/notifications")}>Notifications</button>
          <button className="lum-chip" onClick={() => location.assign("/share")}>Share</button>
        </div>
      </aside>

      <style jsx>{`
        .lum-scrim {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.0);
          backdrop-filter: none;
          opacity: 0;
          pointer-events: none;
          transition: opacity 180ms ease;
          z-index: 49;
        }
        .lum-scrim.show {
          background: rgba(0,0,0,0.28);
          backdrop-filter: saturate(140%) blur(4px);
          opacity: 1;
          pointer-events: auto;
        }
        .lum-drawer {
          position: fixed;
          top: 0;
          bottom: 0;
          width: min(86vw, 360px);
          background: rgba(18,18,22,0.82);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          backdrop-filter: blur(16px) saturate(140%);
          box-shadow: 0 8px 28px rgba(0,0,0,0.45);
          transform: translateX(0);
          transition: transform 220ms ease;
          z-index: 50;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .lum-drawer.left { left: 0; transform: translateX(-100%); border-right: 1px solid rgba(255,255,255,0.06); }
        .lum-drawer.right { right: 0; transform: translateX(100%); border-left: 1px solid rgba(255,255,255,0.06); }
        .lum-drawer.open.left { transform: translateX(0); }
        .lum-drawer.open.right { transform: translateX(0); }

        .lum-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lum-drawer-body {
          padding: 12px 14px;
          display: grid;
          gap: 10px;
          align-content: start;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
        .lum-drawer-body a {
          color: #dfe7ff;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
        }
        .lum-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          border-radius: 8px;
          padding: 6px 10px;
        }
        .lum-chip {
          display: inline-block;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
        }
        @media (min-width: 960px) {
          .lum-drawer { width: 360px; }
        }
      `}</style>
    </>
  );
}