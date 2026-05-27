import { isAdEligible, allowedAdTypes } from "./eligibility";
import { isCooldownPassed } from "./cooldown";
import { canShowMoreAds } from "./frequency";
import { UserState } from "@/src/monetization/config/stateModel";

export type AdEngineInput = {
  state: UserState;
  notNowActive?: boolean;
  lastAdAt?: number;
  now: number;
  minIntervalMs: number;
  adsShown: number;
  maxAdsPerSession: number;
};

export function evaluateAdGate(input: AdEngineInput) {
  const eligible = isAdEligible({
    state: input.state,
    notNowActive: input.notNowActive,
  });

  const cooldown = isCooldownPassed({
    lastAdAt: input.lastAdAt,
    now: input.now,
    minIntervalMs: input.minIntervalMs,
  });

  const frequency = canShowMoreAds({
    adsShown: input.adsShown,
    maxAdsPerSession: input.maxAdsPerSession,
  });

  return {
    allow:
      eligible &&
      cooldown &&
      frequency,
    types: eligible ? allowedAdTypes(input.state) : [],
  };
}
