import type { Constellation } from "../constellations/types";

export type Heartfire = {
  constellationId: string;
  warmth: number;
  activeMembers: number;
  lastPulseAt: string;
};

export function createHeartfire(constellation: Constellation): Heartfire {
  return {
    constellationId: constellation.id,
    warmth: Math.min(100, Math.max(0, constellation.syncScore)),
    activeMembers: 0,
    lastPulseAt: new Date().toISOString(),
  };
}
