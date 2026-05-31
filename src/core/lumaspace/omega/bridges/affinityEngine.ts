import type { BridgeCandidate, BridgeGate, SoulThreadProfile } from "./types";
import { canUseSoulThread } from "./soulThreadEngine";

function overlap(a: string[], b: string[]): string[] {
  const set = new Set(a);
  return b.filter((item) => set.has(item));
}

export function calculateAffinity(
  viewer: SoulThreadProfile,
  candidate: SoulThreadProfile,
  gate: BridgeGate,
): BridgeCandidate {
  if (!canUseSoulThread(viewer) || !canUseSoulThread(candidate)) {
    return {
      citizenId: candidate.citizenId,
      gate,
      affinityScore: 0,
      sharedSignals: [],
      previewVerse: candidate.openingVerse,
      identityBlurred: true,
    };
  }

  const contributionOverlap = overlap(viewer.contributionTags, candidate.contributionTags);
  const communityOverlap = overlap(viewer.communityIds, candidate.communityIds);
  const wisdomOverlap = overlap(viewer.wisdomTopics, candidate.wisdomTopics);
  const missionOverlap = overlap(viewer.missionDomains, candidate.missionDomains);

  const gateBoost =
    gate === "purpose" ? missionOverlap.length * 18 :
    gate === "wisdom" ? wisdomOverlap.length * 18 :
    contributionOverlap.length * 12;

  const affinityScore = Math.min(
    100,
    contributionOverlap.length * 12 +
    communityOverlap.length * 10 +
    wisdomOverlap.length * 14 +
    missionOverlap.length * 14 +
    gateBoost,
  );

  return {
    citizenId: candidate.citizenId,
    gate,
    affinityScore,
    sharedSignals: [
      ...contributionOverlap.map((item) => `contribution:${item}`),
      ...communityOverlap.map((item) => `community:${item}`),
      ...wisdomOverlap.map((item) => `wisdom:${item}`),
      ...missionOverlap.map((item) => `mission:${item}`),
    ],
    previewVerse: candidate.openingVerse,
    identityBlurred: true,
  };
}

export function rankBridgeCandidates(candidates: BridgeCandidate[]): BridgeCandidate[] {
  return [...candidates].sort((a, b) => b.affinityScore - a.affinityScore || a.citizenId.localeCompare(b.citizenId));
}
