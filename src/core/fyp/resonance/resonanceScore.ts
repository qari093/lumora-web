import type { ResonanceProfile } from "../imprints/types";

export function calculateResonanceScore(
  profile: Omit<ResonanceProfile, "resonanceScore">
): ResonanceProfile {
  const score =
    (profile.imprintCount * 5) +
    (profile.replayCount * 2) +
    (profile.saveCount * 4) +
    (profile.capsuleCount * 8);

  return {
    ...profile,
    resonanceScore: score
  };
}

export function assertHighResonance(
  profile: ResonanceProfile
): boolean {
  return profile.resonanceScore >= 100;
}
