export type ResonanceUtility =
  | "creator_aesthetic"
  | "constellation_ritual"
  | "resonance_boost"
  | "garden_enhancement"
  | "atmosphere_pack";

export interface UtilityListing {
  id: string;
  utility: ResonanceUtility;
  priceSilentCoins: number;
  payToWinReach: false;
}

export function createUtilityListing(input: {
  id: string;
  utility: ResonanceUtility;
  priceSilentCoins: number;
}): UtilityListing {
  return {
    id: input.id,
    utility: input.utility,
    priceSilentCoins: Math.max(0, Math.min(input.priceSilentCoins, 10000)),
    payToWinReach: false
  };
}

export function validateUtilityListing(listing: UtilityListing): boolean {
  return listing.priceSilentCoins >= 0 && listing.payToWinReach === false;
}
