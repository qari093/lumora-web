import type {
  RealFeedCandidate
} from "./types";

export function normalizeCandidate(
  candidate: RealFeedCandidate
): RealFeedCandidate {
  return {
    ...candidate,
    intensity: Math.max(0, Math.min(100, candidate.intensity)),
    trustScore: Math.max(0, Math.min(100, candidate.trustScore)),
    safetyScore: Math.max(0, Math.min(100, candidate.safetyScore)),
    noveltyScore: Math.max(0, Math.min(100, candidate.noveltyScore)),
    resonanceScore: Math.max(0, Math.min(100, candidate.resonanceScore)),
    voltageScore: Math.max(0, Math.min(100, candidate.voltageScore))
  };
}

export function buildRealFeedCandidates(
  candidates: RealFeedCandidate[]
): RealFeedCandidate[] {
  return candidates
    .map(normalizeCandidate)
    .filter(candidate => candidate.safetyScore >= 70)
    .filter(candidate => candidate.trustScore >= 40);
}
