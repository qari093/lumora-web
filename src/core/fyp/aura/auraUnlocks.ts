import type { AuraTier } from "./auraTypes";

export type AuraUnlock = {
  tier: AuraTier;
  feedInjection: boolean;
  relicEligibility: boolean;
  flareHosting: boolean;
  phantomAccess: boolean;
  legendaryContracts: boolean;
};

export function getAuraUnlocks(tier: AuraTier): AuraUnlock {
  const rank: Record<AuraTier, number> = {
    wire: 1,
    spark: 2,
    blaze: 3,
    volt: 4,
    singularity: 5
  };

  const level = rank[tier];

  return {
    tier,
    feedInjection: level >= 2,
    relicEligibility: level >= 3,
    flareHosting: level >= 3,
    phantomAccess: level >= 4,
    legendaryContracts: level >= 5
  };
}
