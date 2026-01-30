"use client";

import React, { useEffect, useMemo, useState } from "react";
import LumoraSplash from "@/components/splash/LumoraSplash";

type SplashGateProps = {
  /**
   * Total time the splash remains visible (ms) when animation is enabled.
   * Keep modest to avoid perceived "loading screens".
   */
  durationMs?: number;

  /**
   * Optional fade-out tail (ms). Applied within the total duration.
   */
  fadeOutMs?: number;

  /**
   * Session storage key used to ensure once-per-session display.
   */
  sessionKey?: string;

  /**
   * If true, disables session gating (always show once per mount).
   */
  disableSessionGate?: boolean;
};

function safeWindow(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

function prefersReducedMotion(): boolean {
  const w = safeWindow();
  if (!w || typeof w.matchMedia !== "function") return false;
  try {
    return w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function readSessionFlag(key: string): boolean {
  const w = safeWindow();
  if (!w) return false;
  try {
    return w.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeSessionFlag(key: string): void {
  const w = safeWindow();
  if (!w) return;
  try {
    w.sessionStorage.setItem(key, "1");
  } catch {
    // ignore
  }
}

/**
 * SplashGate: controls whether/when to display the splash experience.
 * - Once per session (tab) by default
 * - Skips animation for prefers-reduced-motion
 * - Avoids SSR/hydration mismatch (client-only visibility decisions)
 */
export default function SplashGate(props: SplashGateProps) {
  const durationMs = typeof props.durationMs === "number" ? props.durationMs : 1400;
  const fadeOutMs = typeof props.fadeOutMs === "number" ? props.fadeOutMs : 220;
  const sessionKey = props.sessionKey ?? "lumora:splash:shown:v1";
  const disableSessionGate = props.disableSessionGate === true;

  const reduced = useMemo(() => prefersReducedMotion(), []);
  const [mounted, setMounted] = useState(false);
const [visible, setVisible] = useState<boolean>(() => {
    // Decide client-side only. During SSR, keep false to avoid mismatches.
    if (typeof window === "undefined") return false;

    if (reduced) return false;
if (disableSessionGate) return true;

    const already = readSessionFlag(sessionKey);
    return !already;
  });
useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!visible) return;

    // Mark once-per-session as soon as we show it (prevents double show on fast refresh/navigation).
    if (!disableSessionGate) writeSessionFlag(sessionKey);

    const safeFade = Math.max(0, Math.min(fadeOutMs, durationMs));
    const t = window.setTimeout(() => setVisible(false), Math.max(0, durationMs - safeFade));
    return () => window.clearTimeout(t);
  }, [mounted, visible, durationMs, fadeOutMs, sessionKey, disableSessionGate]);

  // If reduced motion, never render splash. If not mounted yet, keep null to prevent flicker.
  if (!mounted) return null;
  if (!visible) return null;

  return (
    <LumoraSplash
      // LumoraSplash should gracefully accept these props; if not, it will ignore unknown props.
      // We pass `fadeOutMs` to allow a smooth fade-out tail.
      fadeOutMs={fadeOutMs}
      onDone={() => setVisible(false)}
    />
  );
}
