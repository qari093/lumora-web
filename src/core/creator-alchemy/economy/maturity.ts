import type { EconomyMaturityInput, EconomyMaturityResult } from "./types";

export const FIAT_BRIDGE_CREATOR_THRESHOLD = 100_000;
export const FIAT_BRIDGE_MAU_THRESHOLD = 1_000_000;

export function evaluateEconomyMaturity(input: EconomyMaturityInput): EconomyMaturityResult {
  const reasons: string[] = [];

  if (input.monthlyActiveCreators < FIAT_BRIDGE_CREATOR_THRESHOLD) reasons.push("creator_threshold_not_met");
  if (input.monthlyActiveUsers < FIAT_BRIDGE_MAU_THRESHOLD) reasons.push("mau_threshold_not_met");
  if (!input.antiFraudReady) reasons.push("anti_fraud_not_ready");
  if (!input.moderationStable) reasons.push("moderation_not_stable");
  if (!input.creatorCultureStable) reasons.push("creator_culture_not_stable");

  if (reasons.length === 0) {
    return {
      stage: "fiat_ready",
      fiatBridgeAllowed: true,
      reasons: ["all_maturity_conditions_met"]
    };
  }

  if (input.monthlyActiveCreators >= 10_000 && input.monthlyActiveUsers >= 100_000) {
    return {
      stage: "utility",
      fiatBridgeAllowed: false,
      reasons
    };
  }

  return {
    stage: "symbolic",
    fiatBridgeAllowed: false,
    reasons
  };
}
