import type { PurposeMatch, PurposeMode, PurposeProfile } from "./types";
import { canUsePurposeProfile } from "./profileEngine";
import { findComplementarySkills } from "./skillEngine";

function overlap(a: string[], b: string[]): string[] {
  const set = new Set(a);
  return b.filter((item) => set.has(item));
}

export function createPurposeMatch(input: {
  a: PurposeProfile;
  b: PurposeProfile;
  mode: PurposeMode;
}): PurposeMatch {
  if (!canUsePurposeProfile(input.a) || !canUsePurposeProfile(input.b)) {
    throw new Error("purpose_consent_required");
  }

  if (!input.a.modes.includes(input.mode) || !input.b.modes.includes(input.mode)) {
    throw new Error("mode_not_shared");
  }

  const sharedDomains = overlap(input.a.missionDomains, input.b.missionDomains);
  const complementarySkills = findComplementarySkills(input.a.skills, input.b.skills);

  const availabilityBoost =
    input.a.availability === "high" && input.b.availability === "high" ? 15 :
    input.a.availability !== "low" && input.b.availability !== "low" ? 8 :
    0;

  const matchScore = Math.min(
    100,
    sharedDomains.length * 18 + complementarySkills.length * 24 + availabilityBoost,
  );

  return {
    id: `purpose_match_${input.a.citizenId}_${input.b.citizenId}_${input.mode}`,
    citizenA: input.a.citizenId,
    citizenB: input.b.citizenId,
    mode: input.mode,
    matchScore,
    sharedDomains,
    complementarySkills,
  };
}

export function rankPurposeMatches(matches: PurposeMatch[]): PurposeMatch[] {
  return [...matches].sort((a, b) => b.matchScore - a.matchScore || a.id.localeCompare(b.id));
}
