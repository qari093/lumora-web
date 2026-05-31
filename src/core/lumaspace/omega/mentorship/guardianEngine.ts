import type { GuardianProfile, WisdomDomain } from "./types";

export function createGuardianProfile(input: GuardianProfile): GuardianProfile {
  if (!input.guardianId.trim()) throw new Error("guardianId_required");
  if (!input.displayName.trim()) throw new Error("displayName_required");
  if (input.domains.length === 0) throw new Error("wisdom_domain_required");

  return {
    ...input,
    domains: Array.from(new Set(input.domains)),
    trustScore: Math.max(0, Math.min(100, input.trustScore)),
    maxActiveMentorships: Math.max(1, input.maxActiveMentorships),
    activeMentorships: Math.max(0, input.activeMentorships),
  };
}

export function canGuardianMentor(guardian: GuardianProfile, domain: WisdomDomain): boolean {
  return (
    guardian.available &&
    guardian.guardianGlowVisible &&
    guardian.trustScore >= 70 &&
    guardian.domains.includes(domain) &&
    guardian.activeMentorships < guardian.maxActiveMentorships
  );
}
