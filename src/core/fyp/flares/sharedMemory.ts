import type {
  FlareMemory
} from "./types";

import type { SynchronicityFlare } from "./types";

export function preserveFlareMemory(
  flare: SynchronicityFlare
): FlareMemory {
  return {
    memoryId: `memory_${flare.flareId}`,
    flareId: flare.flareId,
    preservedParticipants: flare.participants.length,
    emotionalIntensity: flare.collectiveEnergy,
    createdAt: Date.now()
  };
}
