"use client";

import HomeBeaconDashboard from "./HomeBeaconDashboard";
import HomeBeaconPortalArc from "./HomeBeaconPortalArc";
import { useEffect, useState } from "react";
import {
DEFAULT_HOME_BEACON_CONFIG,
  computeHomeBeaconBreath,
  createHomeBeaconTelemetry,
  isHomeBeaconEnabled,
  nextHomeBeaconState,
  type HomeBeaconState,
} from "@/src/core/home-beacon";

export default function HomeBeacon() {
  const [state, setState] = useState<HomeBeaconState>("idle");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isHomeBeaconEnabled()) {
      setState("disabled");
      return;
    }

    const id = window.setInterval(() => setTick(performance.now()), 180);
    window.dispatchEvent(new CustomEvent("lumora:home-beacon", { detail: createHomeBeaconTelemetry("view") }));

    return () => window.clearInterval(id);
  }, []);

  if (state === "disabled") return null;

  const breath = computeHomeBeaconBreath(tick, DEFAULT_HOME_BEACON_CONFIG.breathingMs);

  return (
    <>
      <HomeBeaconPortalArc open={state === "expanded"} />
      <HomeBeaconDashboard />
      <button
      type="button"
      aria-label="Lumora Home Beacon. Double tap to open portals."
      data-testid="lumora-home-beacon"
      data-home-beacon-state={state}
      onClick={() => {
        const next = nextHomeBeaconState(state, "tap");
        setState(next);
        window.dispatchEvent(
          new CustomEvent("lumora:home-beacon", {
            detail: createHomeBeaconTelemetry(next === "expanded" ? "expand" : "tap"),
          }),
        );
      }}
      className="fixed bottom-5 left-1/2 z-[80] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-[1.35rem] border border-cyan-200/30 bg-black/50 text-white shadow-[0_0_34px_rgba(56,189,248,0.35)] backdrop-blur-xl"
      style={{
        transform: `translateX(-50%) scale(${breath.pulseScale})`,
        boxShadow: `0 0 ${24 + breath.particleIntensity * 48}px rgba(56,189,248,${breath.glowOpacity})`,
        transition: "transform 180ms ease-out, box-shadow 180ms ease-out",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[-8px] rounded-[1.65rem] border border-cyan-300/20"
        style={{ opacity: breath.glowOpacity }}
      />
      <span aria-hidden="true" className="relative block h-8 w-8">
        <span className="absolute left-1/2 top-0 h-8 w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(125,249,255,0.9)]" />
        <span className="absolute bottom-0 left-0 h-5 w-8 rounded-b-xl rounded-t-md border border-cyan-100/70 bg-cyan-300/10" />
      </span>
      </button>
    </>
  );
}
