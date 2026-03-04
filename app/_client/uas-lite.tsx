"use client";
import { useEffect, useRef } from "react";

export default function UasLite() {
  const cfg = {
    maxCloses: 3,
    windowMs: 60_000,
    quietHours: 24,
    storageKey: "lumora.uas.quiet.until",
  };
  const closesRef = useRef<number[]>([]);
  const now = () => Date.now();
  const _getQuietUntil = () => Number(localStorage.getItem(cfg.storageKey) || 0);
  const setQuietUntil = (ms: number) => localStorage.setItem(cfg.storageKey, String(ms));
  const _setQuietHours = (h: number) => setQuietUntil(now() + h * 3600_000);

  useEffect(() => {
    const _getQuietUntil = () => {
      try {
        const raw = localStorage.getItem(cfg.storageKey);
        if (!raw) return 0;
        const v = JSON.parse(raw);
        return typeof v?.quietUntil === "number" ? v.quietUntil : 0;
      } catch {
        return 0;
      }
    };

    const _setQuietHours = (hours: number) => {
      try {
        const quietUntil = Date.now() + Math.max(0, hours) * 60 * 60 * 1000;
        localStorage.setItem(cfg.storageKey, JSON.stringify({ quietUntil }));
      } catch {
        // ignore
      }
    };


    if (typeof window === "undefined") return;

    const onOpen = () => {
      const until = getQuietUntil();
      if (until > now()) dispatchEvent(new CustomEvent("lumora:overlay-close"));
    };
    const onClose = () => {
      const t = now(), cutoff = t - cfg.windowMs;
      closesRef.current = closesRef.current.filter(ts => ts >= cutoff);
      closesRef.current.push(t);
      if (closesRef.current.length >= cfg.maxCloses) {
        setQuietHours(cfg.quietHours);
        closesRef.current = [];
        console.log(`UAS-lite → quiet for ${cfg.quietHours}h`);
      }
    };

    addEventListener("lumora:overlay-open", onOpen as EventListener);
    addEventListener("lumora:overlay-close", onClose as EventListener);

    (window as any).UAS = {
      status: () => {
        const until = getQuietUntil();
        return { quietUntil: until, remainingMs: Math.max(0, until - now()) };
      },
      clear: () => { localStorage.removeItem(cfg.storageKey); console.log("UAS-lite: quiet cleared"); },
      snooze: (h: number) => { setQuietHours(h); console.log(`UAS-lite: snoozed for ${h}h`); }
    };

    console.log("%c🟢 UAS-lite ready", "color:limegreen; font-weight:bold");

    return () => {
      removeEventListener("lumora:overlay-open", onOpen as EventListener);
      removeEventListener("lumora:overlay-close", onClose as EventListener);
      delete (window as any).UAS;
    };
  
  }, [cfg.maxCloses, cfg.quietHours, cfg.storageKey, cfg.windowMs]);

  return null;
}
