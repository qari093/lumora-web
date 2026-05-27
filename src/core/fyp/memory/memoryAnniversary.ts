import type { EmotionalTimeCapsule } from "../capsules/types";

export type MemoryAnniversary = {
  capsuleId: string;
  daysOld: number;
  eligible: boolean;
  label: string;
};

export function calculateMemoryAnniversary(input: {
  capsule: EmotionalTimeCapsule;
  now: number;
}): MemoryAnniversary {
  const daysOld = Math.floor(
    (input.now - input.capsule.sealedAt) / (24 * 60 * 60 * 1000)
  );

  const eligible =
    daysOld >= 7 &&
    (daysOld % 7 === 0 || daysOld % 30 === 0);

  return {
    capsuleId: input.capsule.capsuleId,
    daysOld,
    eligible,
    label: eligible
      ? `${input.capsule.title} is calling back`
      : `${input.capsule.title} is still settling`
  };
}
