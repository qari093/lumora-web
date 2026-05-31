export type ContributionKind =
  | "light"
  | "resonance"
  | "weave"
  | "gratitude"
  | "mission_help"
  | "wisdom_help";

export type ContributionVisibility = "private" | "inner_circle" | "community";

export type ContributionEvent = {
  id: string;
  kind: ContributionKind;
  actorId: string;
  targetId: string;
  targetType: "memory" | "signal" | "living_card" | "community" | "bridge" | "mission" | "wisdom";
  visibility: ContributionVisibility;
  warmth: number;
  createdAt: number;
};

export type WarmthAura = {
  ownerId: string;
  warmth: number;
  level: "dim" | "soft" | "glowing" | "radiant";
  visibleTo: ContributionVisibility;
};

export type ResonanceEcho = {
  id: string;
  sourceId: string;
  authorId: string;
  format: "text" | "audio" | "video";
  body: string;
  thoughtful: boolean;
};

export type WeaveThread = {
  id: string;
  sourceId: string;
  sourceOwnerId: string;
  wovenBy: string;
  destinationSpaceId: string;
  attributionPreserved: boolean;
  gratitudeThread: boolean;
};

export type ReflectionBlossom = {
  id: string;
  ownerId: string;
  contributionCount: number;
  dominantKind: ContributionKind;
  privateByDefault: true;
  shareable: boolean;
};
