import { UserState } from "./stateModel";

export type MonetizationConfig = {
  enabled: boolean;
  maxAdsPerSession: number;
  rewardEnabled: boolean;
  statePermissions: Record<UserState, {
    allowAds: boolean;
    allowReward: boolean;
  }>;
};

export const DEFAULT_CONFIG: MonetizationConfig = {
  enabled: false,
  maxAdsPerSession: 3,
  rewardEnabled: true,
  statePermissions: {
    green: { allowAds: true, allowReward: true },
    yellow: { allowAds: true, allowReward: false },
    red: { allowAds: false, allowReward: false },
  },
};
