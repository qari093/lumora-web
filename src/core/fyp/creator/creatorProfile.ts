export type CreatorProfile = {
  creatorId: string;
  displayName: string;
  primaryMode: string;
  verifiedHuman: boolean;
  createdAt: number;
};

export function createCreatorProfile(input: {
  creatorId: string;
  displayName: string;
  primaryMode: string;
  now?: number;
}): CreatorProfile {
  if (!input.creatorId.trim() || !input.displayName.trim()) {
    throw new Error("Creator profile requires creatorId and displayName.");
  }

  return {
    creatorId: input.creatorId,
    displayName: input.displayName,
    primaryMode: input.primaryMode,
    verifiedHuman: true,
    createdAt: input.now ?? Date.now()
  };
}
