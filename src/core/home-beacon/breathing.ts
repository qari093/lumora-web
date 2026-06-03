import type { HomeBeaconVisualState } from "./types";

export function computeHomeBeaconBreath(t: number, breathingMs = 4800): HomeBeaconVisualState {
  const phase = ((t % breathingMs) / breathingMs) * Math.PI * 2;
  const wave = (Math.sin(phase) + 1) / 2;

  return {
    state: "breathing",
    pulseScale: Number((1 + wave * 0.08).toFixed(4)),
    glowOpacity: Number((0.34 + wave * 0.36).toFixed(4)),
    particleIntensity: Number((0.18 + wave * 0.22).toFixed(4)),
  };
}
