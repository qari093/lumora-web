import type { PreloadCandidate } from "../types";

export function validatePreloadCandidate(
  candidate: PreloadCandidate
): boolean {
  return Boolean(
    candidate.id &&
    candidate.src &&
    Number.isFinite(candidate.priority) &&
    Number.isFinite(candidate.estimatedBytes)
  );
}
