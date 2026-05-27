import type { Fyp94CrowdSignal } from "./types";

export function anonymizeFyp94CrowdSignal(signal: Fyp94CrowdSignal): Fyp94CrowdSignal {
  return {
    clipId: signal.clipId,
    category: signal.category,
    viewerCount: signal.viewerCount,
    activeWindowId: signal.activeWindowId,
    capturedAt: signal.capturedAt,
  };
}

export function validateFyp94CrowdPrivacy(signal: Fyp94CrowdSignal): boolean {
  return !("userId" in (signal as any)) && !("email" in (signal as any)) && !("ip" in (signal as any));
}
