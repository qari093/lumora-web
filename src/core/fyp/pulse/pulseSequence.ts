import type { FeedItem } from "../core/types";
import type { AtmosphereMode } from "../core/types";

import type { PulseSequence } from "./types";

export function createPulseSequence(input: {
  mode: AtmosphereMode;
  items: FeedItem[];
}): PulseSequence {
  if (input.items.length < 3) {
    throw new Error("Pulse sequence requires at least 3 items.");
  }

  return {
    sequenceId: `pulse_sequence_${input.mode}_${input.items.length}`,
    mode: input.mode,
    durationSeconds: Math.min(90, input.items.length * 12),
    items: input.items
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 8)
  };
}
