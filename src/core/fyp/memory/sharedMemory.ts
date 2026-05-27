import type { EmotionalTimeCapsule } from "../capsules/types";

export type CollaborativeMemorySpace = {
  spaceId: string;
  capsuleIds: string[];
  participantIds: string[];
  sharedMode: string;
  active: boolean;
};

export function createCollaborativeMemorySpace(input: {
  capsuleIds: string[];
  participantIds: string[];
  sharedMode: string;
}): CollaborativeMemorySpace {
  if (input.capsuleIds.length === 0 || input.participantIds.length < 2) {
    throw new Error("Collaborative memory requires capsules and at least 2 participants.");
  }

  return {
    spaceId: `memory_space_${input.sharedMode}_${input.capsuleIds.length}`,
    capsuleIds: input.capsuleIds,
    participantIds: input.participantIds,
    sharedMode: input.sharedMode,
    active: true
  };
}

export function canShareCapsule(
  capsule: EmotionalTimeCapsule
): boolean {
  return capsule.visibility === "shared" || capsule.visibility === "collaborative";
}
