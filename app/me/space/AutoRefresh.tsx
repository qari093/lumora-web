// app/me/space/AutoRefresh.tsx  (Editor — replace entire file)
"use client";
import { useEffect, useRef } from "react";

/**
 * AutoRefresh
 * - Activates only when ?auto=1
 * - Respects ?period=ms with sane bounds (min 3s, max 5m)
 * - Pauses when tab is hidden; resumes on visibilitychange
 * - Skips reload whi
 * le offline; resumes on 'online'
 * - Adds small jitter to avoid thundering herd after hot reloads
 * - Exposes window.dispatchEvent(new CustomEvent("lumora:refresh-now"))
 */
export default function AutoRefresh() {
  const intervalId = useRef<number | null>(null);
  const armed = useRef(false);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const isOn = url.searchParams.get("auto") === "1";
      if (!isOn) return;

      // period param with bounds + jitter (±5%)
      const raw = parseInt(url.searchParams.get("period") || "10000", 10);
      const bounded = Math.min(Math.max(isFinite(raw) ? raw : 10000, 3000), 300000);
      const jitter = Math.round(bounded * (0.95 + Math.random() * 0.10));
      const period = jitter;

      const startTimer = () => {
        if (intervalId.current != null || armed.current === false) return;
        intervalId.current = window.setInterval(() => {
          // Skip if tab hidden or offline
          if (document.hidden) return;
          if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) return;

          // Hard reload to avoid stale state
          window.location.reload();
        }, period) as unknown as number;
      };

      const stopTimer = () => {
        if (intervalId.current != null) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      };

      const onVis = () => {
        if (document.hidden) stopTimer();
        else startTimer();
      };

      const onOnline = () => startTimer();

      const onManual = () => {
        // Immediate refresh request (honors hidden/offline checks)
        if (document.hidden) return;
        if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) return;
        window.location.reload();
      };

      // Arm and attach
      armed.current = true;
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("online", onOnline);
      window.addEventListener("lumora:refresh-now", onManual as EventListener);

      // Start once if visible
      if (!document.hidden) startTimer();

      // Cleanup
      return () => {
        armed.current = false;
        stopTimer();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("online", onOnline);
        window.removeEventListener("lumora:refresh-now", onManual as EventListener);
      };
    } catch {
      // Silent — feature is strictly opt-in via query param
    }
  }, []);

  return null;
}