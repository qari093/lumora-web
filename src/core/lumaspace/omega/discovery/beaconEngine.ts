import type { DiscoveryBeacon } from "./types";

export function createDiscoveryBeacon(input: DiscoveryBeacon): DiscoveryBeacon {
  if (!input.id.trim()) throw new Error("beacon_id_required");
  if (!input.targetId.trim()) throw new Error("targetId_required");

  return {
    ...input,
    interestTags: Array.from(new Set(input.interestTags)),
    trustScore: Math.max(0, Math.min(100, input.trustScore)),
    noveltyScore: Math.max(0, Math.min(100, input.noveltyScore)),
    activityScore: Math.max(0, Math.min(100, input.activityScore)),
    partiallyHidden: true,
  };
}

export function scoreDiscoveryBeacon(beacon: DiscoveryBeacon, userTags: string[]): number {
  const tagOverlap = beacon.interestTags.filter((tag) => userTags.includes(tag)).length;
  return Math.round(
    tagOverlap * 18 +
    beacon.trustScore * 0.35 +
    beacon.noveltyScore * 0.35 +
    beacon.activityScore * 0.3,
  );
}
