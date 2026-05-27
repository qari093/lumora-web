export type CreatorPresenceState =
  | "at-rest"
  | "awaiting-circle"
  | "being-witnessed"
  | "after-witness"
  | "echo-active";

export type CreatorIdentity = {
  creatorId: string;
  displayName: string;
  createdAt: string;
  presenceState: CreatorPresenceState;
  publicVanityMetricsVisible: false;
};

export function createCreatorIdentity(input: {
  creatorId: string;
  displayName: string;
  createdAt?: string;
}): CreatorIdentity {
  return {
    creatorId: input.creatorId,
    displayName: input.displayName.trim(),
    createdAt: input.createdAt || new Date().toISOString(),
    presenceState: "at-rest",
    publicVanityMetricsVisible: false,
  };
}
