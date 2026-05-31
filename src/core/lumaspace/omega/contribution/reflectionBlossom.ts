import type { ContributionEvent, ContributionKind, ReflectionBlossom } from "./types";

export function createReflectionBlossom(ownerId: string, events: ContributionEvent[]): ReflectionBlossom {
  if (!ownerId.trim()) throw new Error("ownerId_required");

  const ownEvents = events.filter((event) => event.actorId === ownerId || event.targetId === ownerId);
  const counts = new Map<ContributionKind, number>();

  for (const event of ownEvents) {
    counts.set(event.kind, (counts.get(event.kind) ?? 0) + 1);
  }

  const dominantKind = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "light";

  return {
    id: `reflection_blossom_${ownerId}_${ownEvents.length}`,
    ownerId,
    contributionCount: ownEvents.length,
    dominantKind,
    privateByDefault: true,
    shareable: false,
  };
}

export function enableReflectionBlossomSharing(blossom: ReflectionBlossom): ReflectionBlossom {
  return {
    ...blossom,
    shareable: true,
  };
}
