"use client";

import { useEffect, useRef, useState } from "react";
import {
  GravityCoreController,
  computeGravityFeedback,
  computeGravityVisualField,
  createGravityShadowTelemetryEvent,
  recordGravityShadowTelemetry,
  type GravityIntentResult,
} from "@/src/core/gravity-core";

type GravityCoreShadowExperienceProps = {
  enabled?: boolean;
};

export default function GravityCoreShadowExperience({ enabled = true }: GravityCoreShadowExperienceProps) {
  const controllerRef = useRef<GravityCoreController | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastRingRef = useRef(false);
  const lastPreviewRef = useRef(false);
  const [snapshot, setSnapshot] = useState<GravityIntentResult | null>(null);

  useEffect(() => {
    if (!enabled) return;

    controllerRef.current = new GravityCoreController("shadow");

    const sample = () => {
      frameRef.current = null;
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

      const feedback = computeGravityFeedback(result);
      recordGravityShadowTelemetry(createGravityShadowTelemetryEvent("shadow_sample", result));

      if (result.shouldShowRing && !lastRingRef.current) {
        recordGravityShadowTelemetry(createGravityShadowTelemetryEvent("ring_visible", result));
      }

      if (feedback.hapticPreview && !lastPreviewRef.current) {
        recordGravityShadowTelemetry(createGravityShadowTelemetryEvent("haptic_preview", result));
        if ("vibrate" in navigator) navigator.vibrate?.(8);
      }

      if (feedback.hapticConfirm && !lastRingRef.current) {
        recordGravityShadowTelemetry(createGravityShadowTelemetryEvent("haptic_confirm", result));
        if ("vibrate" in navigator) navigator.vibrate?.([8, 18, 8]);
      }

      lastRingRef.current = result.shouldShowRing;
      lastPreviewRef.current = feedback.hapticPreview;
      setSnapshot(result);
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

  const visual = snapshot
    ? computeGravityVisualField(snapshot)
    : {
        vignetteIntensity: 0,
        wellOpacity: 0,
        ringOpacity: 0,
        ringScale: 0.78,
        ringVisible: false,
        labelVisible: false,
      };

  return (
    <div
      aria-hidden="true"
      data-gravity-core-shadow-experience="true"
      data-gravity-ring={visual.ringVisible ? "visible" : "hidden"}
      className="pointer-events-none fixed inset-0 z-[36]"
      style={{
        background: `radial-gradient(circle at 50% 100%, rgba(70,255,214,${visual.vignetteIntensity}) 0%, rgba(0,0,0,0) 46%)`,
        transition: "background 140ms ease-out",
      }}
    >
      <div
        className="absolute left-1/2 bottom-7 h-20 w-20 -translate-x-1/2 rounded-full border border-emerald-200/50 shadow-[0_0_40px_rgba(70,255,214,0.18)]"
        style={{
          opacity: visual.ringOpacity,
          transform: `translateX(-50%) scale(${visual.ringScale}) rotate(${visual.ringVisible ? "8deg" : "0deg"})`,
          transition: "opacity 160ms ease-out, transform 180ms ease-out",
        }}
      />
      <div
        className="absolute left-1/2 bottom-32 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/80 backdrop-blur-md"
        style={{
          opacity: visual.labelVisible ? 1 : 0,
          transform: `translateX(-50%) translateY(${visual.labelVisible ? "0" : "6px"})`,
          transition: "opacity 140ms ease-out, transform 140ms ease-out",
        }}
      >
        Pull to return
      </div>
    </div>
  );
}
