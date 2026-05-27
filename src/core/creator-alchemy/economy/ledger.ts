import type { QuietGift, ResonanceGarden, ResonanceLedger, ResonanceLedgerState } from "./types";
import { totalGiftEnergy } from "./gifts";

export function ledgerStateFromEnergy(energy: number): ResonanceLedgerState {
  if (energy >= 5000) return "resonant_tide";
  if (energy >= 2000) return "glowing_river";
  if (energy >= 500) return "blooming_current";
  return "quiet_lake";
}

export function buildResonanceLedger(creatorId: string, gifts: readonly QuietGift[]): ResonanceLedger {
  const resonanceEnergy = totalGiftEnergy(gifts);

  return {
    creatorId,
    resonanceEnergy,
    state: ledgerStateFromEnergy(resonanceEnergy),
    horizonProgress: normalizeProgress(resonanceEnergy / 5000)
  };
}

export function buildResonanceGarden(creatorId: string, gifts: readonly QuietGift[]): ResonanceGarden {
  const count = gifts.length;
  const rareBlooms = gifts.filter((gift) => gift.type === "star" || gift.type === "lantern").length;

  return {
    creatorId,
    plants: Math.floor(count / 100),
    trees: Math.floor(count / 1000),
    rareBlooms
  };
}

function normalizeProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
