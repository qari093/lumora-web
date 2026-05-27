import type { OneNightSkyState } from "./types";

export function buildOneNightSkyState(input: {
  triggerStrength: number;
  userOptedIn: boolean;
  requestedDurationMinutes?: number;
}): OneNightSkyState {
  const active = input.userOptedIn && input.triggerStrength >= 0.85;
  const duration = Math.max(1, Math.min(input.requestedDurationMinutes ?? 10, 10));

  return {
    active,
    optional: true,
    blocksCoreUse: false,
    durationMinutes: active ? duration : 0
  };
}
