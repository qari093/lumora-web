"use client";
import { useEffect } from "react";

type CoachOpts = {
  delayMs?: number;
  tint?: { h:number; s:number; l:number };
  storageKey?: string;
};

export default function OverlayCoachOnce(opts: CoachOpts = {}) {
  const { delayMs = 1800, tint = { h: 220, s: 70, l: 60 }, storageKey = "lumora.overlay.coach.v1" } = opts;

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (localStorage.getItem(storageKey) === "done") return;
      const t = setTimeout(() => {
        dispatchEvent(new CustomEvent("lumora:tint", { detail: tint }));
        dispatchEvent(new CustomEvent("lumora:overlay-open"));
        localStorage.setItem(storageKey, "done");
      }, delayMs);
      return () => clearTimeout(t);
    } catch {}
  }, [delayMs, tint, storageKey]);

  return null;
}
