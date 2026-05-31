import type { PurposeProfile } from "./types";

export function createPurposeProfile(input: PurposeProfile): PurposeProfile {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  return {
    ...input,
    modes: Array.from(new Set(input.modes)),
    missionDomains: Array.from(new Set(input.missionDomains)),
  };
}

export function canUsePurposeProfile(profile: PurposeProfile): boolean {
  return profile.consentGranted && profile.modes.length > 0;
}
