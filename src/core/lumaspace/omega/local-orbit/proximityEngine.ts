import type { LocalMatch, LocalSignal } from "./types";

export function createLocalSignal(input: Omit<LocalSignal, "identityBlurred">): LocalSignal {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (!input.cityHash.trim()) throw new Error("cityHash_required");

  return {
    ...input,
    interestTags: Array.from(new Set(input.interestTags)),
    trustScore: Math.max(0, Math.min(100, input.trustScore)),
    identityBlurred: true,
  };
}

export function createLocalMatch(a: LocalSignal, b: LocalSignal): LocalMatch | null {
  if (a.citizenId === b.citizenId) return null;
  if (a.cityHash !== b.cityHash) return null;
  if (a.trustScore < 60 || b.trustScore < 60) return null;

  const sharedTags = a.interestTags.filter((tag) => b.interestTags.includes(tag));
  if (sharedTags.length === 0) return null;

  return {
    id: `local_match_${a.citizenId}_${b.citizenId}`,
    citizenA: a.citizenId,
    citizenB: b.citizenId,
    sharedTags,
    safe: true,
  };
}
