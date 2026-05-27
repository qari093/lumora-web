import type { LiveEconomyPolicy } from "./types";

export const LIVE_ECONOMY_POLICY: LiveEconomyPolicy = {
  casinoLoopsAllowed: false,
  rageIncentivesAllowed: false,
  speculativeRelicsAllowed: false,
  whaleProtectionEnabled: true,
};

export function validateLiveEconomyPolicy(policy: LiveEconomyPolicy = LIVE_ECONOMY_POLICY): boolean {
  return (
    policy.casinoLoopsAllowed === false &&
    policy.rageIncentivesAllowed === false &&
    policy.speculativeRelicsAllowed === false &&
    policy.whaleProtectionEnabled === true
  );
}
