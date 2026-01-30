"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  /** default 620ms: fast, premium, not janky on iPhone */
  durationMs?: number;
  /** show once per tab/session */
  oncePerSession?: boolean;
  /** optional: force show (debug) */
  force?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function LumoraLaunchSplash({
  durationMs = 620,
  oncePerSession = true,
  force = false,
}: Props) {
  const key = "LUMORA_SPLASH_SEEN_V1";
  const reduce = useMemo(() => prefersReducedMotion(), []);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) return; // accessibility: skip animation
    if (force) {
      setShow(true);
      return;
    }
    if (!oncePerSession) {
      setShow(true);
      return;
    }
    try {
      const seen = sessionStorage.getItem(key) === "1";
      if (!seen) {
        sessionStorage.setItem(key, "1");
        setShow(true);
      }
    } catch {
      // sessionStorage blocked: still show (best-effort)
      setShow(true);
    }
  }, [reduce, force, oncePerSession]);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setShow(false), Math.max(250, durationMs));
    return () => window.clearTimeout(t);
  }, [show, durationMs]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="lumoraLaunchSplash"
      // prevent scroll-jank on iOS during first paint
      style={{ touchAction: "none" as any }}
    >
      <div className="lumoraLaunchSplash__bg" />
      <div className="lumoraLaunchSplash__blade" />
      <div className="lumoraLaunchSplash__shine" />
      <style jsx global>{`
        .lumoraLaunchSplash {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          pointer-events: none;
          overflow: hidden;
        }

        /* Dark glass base (match your theme) */
        .lumoraLaunchSplash__bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              1200px 800px at 50% 45%,
              rgba(0, 229, 255, 0.06),
              rgba(0, 0, 0, 0) 55%
            ),
            radial-gradient(
              900px 700px at 55% 55%,
              rgba(140, 92, 255, 0.05),
              rgba(0, 0, 0, 0) 60%
            ),
            #000;
          animation: lumoraSplashFadeOut ${durationMs}ms ease forwards;
          will-change: opacity;
        }

        /*
          Blade bloom illusion:
          - uses a masked gradient “blade” shape (no image dependency)
          - if you later want exact blade PNG/SVG, swap this div’s background-image.
        */
        .lumoraLaunchSplash__blade {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(44vw, 260px);
          height: min(66vw, 380px);
          transform: translate(-50%, -50%) scale(0.86);
          border-radius: 999px;
          background:
            radial-gradient(60% 60% at 48% 28%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%),
            linear-gradient(160deg,
              rgba(0, 229, 255, 0.0) 0%,
              rgba(0, 229, 255, 0.75) 20%,
              rgba(142, 96, 255, 0.65) 55%,
              rgba(0, 229, 255, 0.35) 86%,
              rgba(0, 229, 255, 0.0) 100%
            );
          filter:
            drop-shadow(0 0 14px rgba(0, 229, 255, 0.20))
            drop-shadow(0 0 24px rgba(142, 96, 255, 0.10));
          clip-path: polygon(
            52% 0%,
            60% 8%,
            64% 18%,
            66% 28%,
            67% 40%,
            66% 54%,
            63% 68%,
            58% 80%,
            52% 92%,
            48% 100%,
            43% 92%,
            40% 80%,
            37% 68%,
            34% 54%,
            33% 40%,
            34% 28%,
            36% 18%,
            40% 8%
          );
          animation: lumoraBladePop ${durationMs}ms cubic-bezier(.2,.9,.2,1) forwards;
          will-change: transform, opacity, filter;
          opacity: 0;
        }

        /* subtle diagonal sweep */
        .lumoraLaunchSplash__shine {
          position: absolute;
          left: -40%;
          top: 0;
          width: 180%;
          height: 100%;
          background: linear-gradient(
            105deg,
            rgba(0, 0, 0, 0) 40%,
            rgba(0, 229, 255, 0.08) 50%,
            rgba(0, 0, 0, 0) 60%
          );
          transform: translateX(0);
          animation: lumoraShine ${durationMs}ms ease forwards;
          mix-blend-mode: screen;
          will-change: transform, opacity;
          opacity: 0;
        }

        @keyframes lumoraBladePop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.78);
            filter:
              drop-shadow(0 0 8px rgba(0, 229, 255, 0.10))
              drop-shadow(0 0 10px rgba(142, 96, 255, 0.06));
          }
          18% {
            opacity: 1;
          }
          58% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.02);
            filter:
              drop-shadow(0 0 18px rgba(0, 229, 255, 0.22))
              drop-shadow(0 0 30px rgba(142, 96, 255, 0.12));
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.22);
            filter:
              drop-shadow(0 0 4px rgba(0, 229, 255, 0.0))
              drop-shadow(0 0 6px rgba(142, 96, 255, 0.0));
          }
        }

        @keyframes lumoraShine {
          0% { opacity: 0; transform: translateX(-6%); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateX(10%); }
        }

        @keyframes lumoraSplashFadeOut {
          0% { opacity: 1; }
          88% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
