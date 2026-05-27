import type { ConstellationId, ConstellationProfile } from "./types";

export const CONSTELLATIONS: Record<ConstellationId, ConstellationProfile> = {
  midnight_souls: {
    id: "midnight_souls",
    name: "Midnight Souls",
    atmosphere: "quiet depth, late reflection, intimate voice",
    opposite: "neon_dreamers"
  },
  quiet_chaos: {
    id: "quiet_chaos",
    name: "Quiet Chaos",
    atmosphere: "contained intensity, fragmented beauty, soft disorder",
    opposite: "healing_humor"
  },
  neon_dreamers: {
    id: "neon_dreamers",
    name: "Neon Dreamers",
    atmosphere: "hopeful color, future energy, luminous motion",
    opposite: "midnight_souls"
  },
  healing_humor: {
    id: "healing_humor",
    name: "Healing Humor",
    atmosphere: "lightness, recovery, emotional comedy",
    opposite: "quiet_chaos"
  },
  slow_fire: {
    id: "slow_fire",
    name: "Slow Fire",
    atmosphere: "controlled passion, restrained force, patient intensity",
    opposite: "restless_voices"
  },
  restless_voices: {
    id: "restless_voices",
    name: "Restless Voices",
    atmosphere: "movement, friction, searching speech",
    opposite: "slow_fire"
  }
};

export function getConstellation(id: ConstellationId): ConstellationProfile {
  return CONSTELLATIONS[id];
}

export function getOppositeConstellation(id: ConstellationId): ConstellationProfile {
  return CONSTELLATIONS[CONSTELLATIONS[id].opposite];
}

export function listConstellations(): ConstellationProfile[] {
  return Object.values(CONSTELLATIONS);
}
