import type {
  CapsuleVisibility,
  EmotionalTimeCapsule
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createEmotionalTimeCapsule(input: {
  userId: string;
  title: string;
  mode: AtmosphereMode;
  visibility?: CapsuleVisibility;
  contentIds: string[];
  soundtrackIds?: string[];
  echoImprintIds?: string[];
  culturalPulseId?: string;
  now?: number;
}): EmotionalTimeCapsule {
  if (!input.userId.trim() || !input.title.trim()) {
    throw new Error("Emotional Time Capsule requires userId and title.");
  }

  if (input.contentIds.length === 0) {
    throw new Error("Emotional Time Capsule requires content.");
  }

  const now = input.now ?? Date.now();

  return {
    capsuleId: `capsule_${input.userId}_${now}`,
    userId: input.userId,
    title: input.title,
    mode: input.mode,
    visibility: input.visibility ?? "private",
    contentIds: input.contentIds,
    soundtrackIds: input.soundtrackIds ?? [],
    echoImprintIds: input.echoImprintIds ?? [],
    culturalPulseId: input.culturalPulseId,
    sealedAt: now
  };
}
