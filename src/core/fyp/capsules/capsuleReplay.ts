import type {
  CapsuleReplay,
  EmotionalTimeCapsule
} from "./types";

export function replayEmotionalTimeCapsule(input: {
  capsule: EmotionalTimeCapsule;
  userId: string;
  now?: number;
}): CapsuleReplay {
  if (input.capsule.visibility === "private" && input.capsule.userId !== input.userId) {
    throw new Error("Private capsule replay denied.");
  }

  const now = input.now ?? Date.now();

  return {
    replayId: `replay_${input.capsule.capsuleId}_${input.userId}_${now}`,
    capsuleId: input.capsule.capsuleId,
    userId: input.userId,
    reconstructed: true,
    replayedAt: now
  };
}
