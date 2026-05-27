import { MonetizationVariant } from "./abTest";

export function getVariantTuning(variant: MonetizationVariant) {
  if (variant === "gentle") {
    return { minVideosBetweenAds: 8, rewardMultiplier: 1.05, maxAdsPerSession: 2 };
  }

  if (variant === "reward_heavy") {
    return { minVideosBetweenAds: 6, rewardMultiplier: 1.25, maxAdsPerSession: 3 };
  }

  if (variant === "low_frequency") {
    return { minVideosBetweenAds: 10, rewardMultiplier: 1.1, maxAdsPerSession: 1 };
  }

  return { minVideosBetweenAds: 6, rewardMultiplier: 1, maxAdsPerSession: 3 };
}
