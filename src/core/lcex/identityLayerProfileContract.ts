export type IdentityLayerAffinityCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type IdentityLayerProfileContract = {
  userId: string;
  region?: string;
  language?: string;
  topAffinities: IdentityLayerAffinityCategory[];
  vibeTags: string[];
  discoveryIntensity: "low" | "balanced" | "high";
  trendParticipationOptIn: boolean;
  liveRoomOptIn: boolean;
  updatedAt: string;
};

export function buildIdentityLayerProfileContract(
  input: IdentityLayerProfileContract
): IdentityLayerProfileContract {
  return {
    ...input,
    userId: input.userId.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
    topAffinities: input.topAffinities.slice(0, 5),
    vibeTags: input.vibeTags.map((tag) => tag.trim()).filter(Boolean).slice(0, 12),
  };
}

export function isIdentityLayerProfileUsable(
  profile: IdentityLayerProfileContract
): boolean {
  return (
    profile.userId.length > 0 &&
    profile.topAffinities.length > 0 &&
    profile.discoveryIntensity.length > 0
  );
}
