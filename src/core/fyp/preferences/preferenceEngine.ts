import type {
  FypPreferenceEvent,
  FypPreferenceProfile
} from "./preferenceTypes";

export function createEmptyPreferenceProfile(
  userId: string
): FypPreferenceProfile {
  return {
    userId,
    laneWeights: {},
    updatedAt: Date.now()
  };
}

export function applyPreferenceSignal(
  profile: FypPreferenceProfile,
  event: FypPreferenceEvent
): FypPreferenceProfile {
  if (!event.userId || event.userId !== profile.userId) {
    return profile;
  }

  if (!event.assetId || !event.lane || event.ts <= 0) {
    return profile;
  }

  const current = profile.laneWeights[event.lane] ?? 1;

  const delta =
    event.signal === "more_like_this" || event.signal === "like"
      ? 0.15
      : -0.15;

  const next = Math.max(0.25, Math.min(2, Number((current + delta).toFixed(2))));

  return {
    ...profile,
    laneWeights: {
      ...profile.laneWeights,
      [event.lane]: next
    },
    updatedAt: event.ts
  };
}
