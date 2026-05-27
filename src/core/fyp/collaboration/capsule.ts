export type CollaborativeCapsule = {
  capsuleId: string;
  forgeId: string;
  preserved: boolean;
  contributorCount: number;
};

export function createCollaborativeCapsule(input: {
  forgeId: string;
  contributorCount: number;
}): CollaborativeCapsule {
  if (input.contributorCount < 2) {
    throw new Error("Collaborative capsule requires multiple contributors.");
  }

  return {
    capsuleId: `capsule_${input.forgeId}`,
    forgeId: input.forgeId,
    preserved: true,
    contributorCount: input.contributorCount
  };
}
