import type { CreatorProfile } from "../types";

export function calculateCreatorScore(
  profile: CreatorProfile
): number {
  let score = profile.reputation;

  if (profile.verified) {
    score += 25;
  }

  if (profile.tier === "elite") {
    score += 50;
  }

  return score;
}
