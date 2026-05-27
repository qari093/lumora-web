import type {
  SynchronicityFlare
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createSynchronicityFlare(input: {
  mode: AtmosphereMode;
  participants: string[];
  collectiveEnergy: number;
  now?: number;
  durationMs?: number;
}): SynchronicityFlare {
  if (input.participants.length < 3) {
    throw new Error("Synchronicity flare requires at least 3 participants.");
  }

  if (input.collectiveEnergy < 1) {
    throw new Error("Synchronicity flare requires collective energy.");
  }

  const now = input.now ?? Date.now();

  return {
    flareId: `flare_${input.mode}_${now}`,
    mode: input.mode,
    participants: input.participants,
    triggeredAt: now,
    expiresAt: now + (input.durationMs ?? 5 * 60 * 1000),
    collectiveEnergy: input.collectiveEnergy,
    active: true
  };
}

export function flareUrgencyLevel(
  flare: SynchronicityFlare
): "low" | "elevated" | "critical" {
  if (flare.collectiveEnergy >= 900) {
    return "critical";
  }

  if (flare.collectiveEnergy >= 400) {
    return "elevated";
  }

  return "low";
}
