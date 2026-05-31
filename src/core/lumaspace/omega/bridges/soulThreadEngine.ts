import type { SoulThreadProfile } from "./types";

export function createSoulThreadProfile(input: SoulThreadProfile): SoulThreadProfile {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (input.openingVerse.length > 60) throw new Error("opening_verse_too_long");

  return {
    ...input,
    contributionTags: Array.from(new Set(input.contributionTags)),
    communityIds: Array.from(new Set(input.communityIds)),
    wisdomTopics: Array.from(new Set(input.wisdomTopics)),
    missionDomains: Array.from(new Set(input.missionDomains)),
  };
}

export function canUseSoulThread(profile: SoulThreadProfile): boolean {
  return profile.consentGranted && profile.openingVerse.trim().length > 0;
}
