import type { OneNightSkyVisualState, SilentPulseState } from "./types";

export function buildSilentPulseState(input: {
  enabled: boolean;
  rareEnough: boolean;
  constellationActive: boolean;
}): SilentPulseState {
  const visible = input.enabled && input.rareEnough && input.constellationActive;

  return {
    visible,
    words: false,
    meaning: visible ? "constellation_alive" : "none"
  };
}

export function buildOneNightSkyVisualState(input: {
  userOptedIn: boolean;
  triggerStrength: number;
  requestedMinutes?: number;
}): OneNightSkyVisualState {
  const active = input.userOptedIn && input.triggerStrength >= 0.85;
  const duration = Math.max(1, Math.min(input.requestedMinutes ?? 10, 10));

  return {
    active,
    optional: true,
    blocksNavigation: false,
    durationMinutes: active ? duration : 0
  };
}
