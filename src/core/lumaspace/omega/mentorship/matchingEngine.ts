import type { GuardianProfile, WisdomDomain } from "./types";
import { canGuardianMentor } from "./guardianEngine";

export function matchGuardian(input: {
  guardians: GuardianProfile[];
  domain: WisdomDomain;
}): GuardianProfile | null {
  const ranked = input.guardians
    .filter((guardian) => canGuardianMentor(guardian, input.domain))
    .sort((a, b) => {
      const capacityA = a.maxActiveMentorships - a.activeMentorships;
      const capacityB = b.maxActiveMentorships - b.activeMentorships;
      return b.trustScore + capacityB * 5 - (a.trustScore + capacityA * 5);
    });

  return ranked[0] ?? null;
}
