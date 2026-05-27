import type {
  EchoEmotion,
  EchoImprint
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createEchoImprint(input: {
  contentId: string;
  emotion: EchoEmotion;
  mode: AtmosphereMode;
  intensity: number;
  anonymous?: boolean;
  now?: number;
}): EchoImprint {
  if (!input.contentId.trim()) {
    throw new Error("Echo imprint requires contentId.");
  }

  if (input.intensity < 1 || input.intensity > 100) {
    throw new Error("Echo imprint intensity out of range.");
  }

  const now = input.now ?? Date.now();

  return {
    imprintId: `echo_${input.contentId}_${now}`,
    contentId: input.contentId,
    emotion: input.emotion,
    mode: input.mode,
    intensity: input.intensity,
    anonymous: input.anonymous ?? true,
    createdAt: now
  };
}
