import type { Fyp94CrowdSignal } from "./types";

export function createFyp94CrowdSignal(input: {
  clipId: string;
  category: string;
  viewerCount: number;
  activeWindowId: string;
  now?: Date;
}): Fyp94CrowdSignal {
  return {
    clipId: input.clipId,
    category: input.category,
    viewerCount: Math.max(0, Math.floor(input.viewerCount)),
    activeWindowId: input.activeWindowId,
    capturedAt: (input.now ?? new Date()).toISOString(),
  };
}

export function incrementFyp94ViewerCount(signal: Fyp94CrowdSignal): Fyp94CrowdSignal {
  return { ...signal, viewerCount: signal.viewerCount + 1 };
}

export function decrementFyp94ViewerCount(signal: Fyp94CrowdSignal): Fyp94CrowdSignal {
  return { ...signal, viewerCount: Math.max(0, signal.viewerCount - 1) };
}
