import type {
  FlareWindow
} from "./types";

import type { SynchronicityFlare } from "./types";

export function createFlareWindow(
  flare: SynchronicityFlare
): FlareWindow {
  return {
    windowId: `window_${flare.flareId}`,
    mode: flare.mode,
    opensAt: flare.triggeredAt,
    closesAt: flare.expiresAt,
    urgencyLevel:
      flare.collectiveEnergy >= 900
        ? "critical"
        : flare.collectiveEnergy >= 400
          ? "elevated"
          : "low"
  };
}

export function isFlareWindowActive(input: {
  window: FlareWindow;
  now: number;
}): boolean {
  return (
    input.now >= input.window.opensAt &&
    input.now <= input.window.closesAt
  );
}
