"use client";

import { useEffect, useRef, useState } from "react";
import { GravityCoreController, type GravityIntentResult } from "@/src/core/gravity-core";

type GravityCoreShadowProps = {
  enabled?: boolean;
};

export default function GravityCoreShadow({ enabled = true }: GravityCoreShadowProps) {
  const controllerRef = useRef<GravityCoreController | null>(null);
  const frameRef = useRef<number | null>(null);
  const [snapshot, setSnapshot] = useState<GravityIntentResult | null>(null);

  useEffect(() => {
    if (!enabled) return;

    controllerRef.current = new GravityCoreController("shadow");

    const sample = () => {
      const controller = controllerRef.current;
      if (!controller) return;

      const doc = document.documentElement;
      const result = controller.sample({
        scrollY: window.scrollY || doc.scrollTop || 0,
        maxScrollY: Math.max(0, doc.scrollHeight - window.innerHeight),
        timestamp: performance.now(),
        viewportHeight: window.innerHeight,
        documentHeight: doc.scrollHeight,
      });

      setSnapshot(result);
      frameRef.current = null;
    };

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(sample);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    sample();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      controllerRef.current?.reset();
      controllerRef.current = null;
    };
  }, [enabled]);

  const intensity = Math.min(0.32, Math.max(0, snapshot?.intentScore ?? 0) * 0.32);
  const ringVisible = Boolean(snapshot?.shouldShowRing);

  return (
    <div
      aria-hidden="true"
      data-gravity-core="shadow"
      data-gravity-state={snapshot?.state ?? "idle"}
      data-gravity-ring={ringVisible ? "visible" : "hidden"}
      className="pointer-events-none fixed inset-0 z-[35]"
      style={{
        background: `radial-gradient(circle at 50% 100%, rgba(116,255,214,${intensity}) 0%, rgba(0,0,0,0) 42%)`,
        transition: "background 160ms ease-out",
      }}
    >
      <div
        className="absolute left-1/2 bottom-8 h-16 w-16 -translate-x-1/2 rounded-full border border-emerald-200/40"
        style={{
          opacity: ringVisible ? 0.34 : 0,
          transform: `translateX(-50%) scale(${ringVisible ? 1 : 0.82})`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
        }}
      />
    </div>
  );
}
