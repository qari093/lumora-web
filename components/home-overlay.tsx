// components/home-overlay.tsx (Segment 3 v2 – corrected icons)
"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

const ICONS: Record<string, string> = {
  "NEXA": "🧘‍♂️",
  "Gmar": "🎮",
  "ZenShop": "🛍️",
  "Wallet": "💰",
  "LumaLink": "💬",
  "Live": "📺",
  "Ads Manager": "📢",
  "Lumen AI": "✨",
  "Profile": "👤",
  "Settings": "⚙️",
  "Music Player": "🎵",
  "Trending": "��",
};

const PATHS: Record<string, string> = {
  "NEXA": "/nexa",
  "Gmar": "/gmar",
  "ZenShop": "/shop",
  "Wallet": "/wallet",
  "LumaLink": "/lumalink",
  "Live": "/live",
  "Ads Manager": "/vendor/camps",
  "Lumen AI": "/lumen",
  "Profile": "/profile",
  "Settings": "/settings",
  "Music Player": "/music",
  "Trending": "/trending",
};

export default function HomeOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const openFn = useCallback(() => setOpen(true), []);
  const go = (label: string) => {
    setOpen(false);
    const path = PATHS[label];
    if (path) setTimeout(() => router.push(path), 120);
  };

  useEffect(() => {
    const onOpen = () => openFn();
    const onClose = () => close();
    addEventListener("lumora:overlay-open", onOpen as EventListener);
    addEventListener("lumora:overlay-close", onClose as EventListener);
    return () => {
      removeEventListener("lumora:overlay-open", onOpen as EventListener);
      removeEventListener("lumora:overlay-close", onClose as EventListener);
    };
  }, [close, openFn]);

  const Portal = useMemo(() => (typeof document === "undefined" ? null : document.body), []);
  if (!Portal) return null;

  return createPortal(
    <div
      ref={rootRef}
      className={`lumora-overlay ${open ? "open" : ""}`}
      onClick={(e) => e.target === rootRef.current && close()}
    >
      <div ref={sheetRef} className="glass-sheet">
        <h2 className="title">Lumora Universe</h2>
        <div className="grid">
          {Object.entries(ICONS).map(([label, icon]) => (
            <button key={label} className="notch" onClick={() => go(label)} title={label}>
              <div className="icon">{icon}</div>
              <div className="label">{label}</div>
            </button>
          ))}
        </div>
        <div className="hint">Tap an icon • Press Esc to close</div>
      </div>

      <style jsx>{`
        .lumora-overlay {
          position: fixed; inset: 0; z-index: 1000;
          display: grid; place-items: center;
          background: rgba(0,0,0,0.03);
          opacity: 0; pointer-events: none;
          transition: opacity .25s ease;
          backdrop-filter: blur(8px);
        }
        .lumora-overlay.open { opacity: 1; pointer-events: auto; }

        .glass-sheet {
          width: min(900px, 92vw);
          border-radius: 28px;
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(25px) saturate(1.25);
          -webkit-backdrop-filter: blur(25px) saturate(1.25);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          padding: 28px 22px 20px;
          text-align: center;
          animation: fadeIn .25s ease forwards;
        }

        @keyframes fadeIn { from {opacity:0;transform:scale(.96);} to {opacity:1;transform:scale(1);} }
        .title { font-weight:900; font-size:26px; margin-bottom:22px; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 18px;
          justify-items: center;
        }

        .notch {
          appearance: none;
          border: none;
          border-radius: 18px;
          padding: 16px 8px;
          width: 100%;
          background: rgba(255,255,255,0.6);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all .25s ease;
        }
        .notch:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15),
                      inset 0 0 0 1px rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.75);
        }
        .notch:active { transform: translateY(-2px) scale(.99); }

        .icon { font-size: 36px; margin-bottom: 8px; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2)); }
        .label { font-weight:700; font-size:14px; }

        .hint { margin-top: 22px; font-size: 12px; opacity: .65; }

        :global(html.dark) .glass-sheet {
          background: rgba(28,28,32,0.55);
          color: #f3f3f6;
          border-color: rgba(255,255,255,0.1);
        }
        :global(html.dark) .notch {
          background: rgba(40,40,46,0.6);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
        }
        :global(html.dark) .notch:hover {
          background: rgba(60,60,70,0.8);
          box-shadow: 0 10px 25px rgba(0,0,0,0.45);
        }
      `}</style>
    </div>,
    Portal
  );
}
