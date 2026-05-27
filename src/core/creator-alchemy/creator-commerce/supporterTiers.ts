import type { SilentSupporterTier } from "./types";

export function createSilentSupporterTier(input: Omit<SilentSupporterTier, "publicRankHidden">): SilentSupporterTier {
  return {
    ...input,
    monthlyPrice: Math.max(0, input.monthlyPrice),
    publicRankHidden: true
  };
}
