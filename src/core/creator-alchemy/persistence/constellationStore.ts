import type { ConstellationProfile } from "./types";

const CONSTELLATIONS: ConstellationProfile[] = [];

export function persistConstellationProfile(profile: ConstellationProfile): ConstellationProfile {
  const existing = CONSTELLATIONS.findIndex((item) => item.creatorId === profile.creatorId);

  if (existing >= 0) {
    CONSTELLATIONS[existing] = profile;
  } else {
    CONSTELLATIONS.push(profile);
  }

  return profile;
}

export function getConstellationProfile(creatorId: string): ConstellationProfile | undefined {
  return CONSTELLATIONS.find((item) => item.creatorId === creatorId);
}
