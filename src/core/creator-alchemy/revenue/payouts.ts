import type { CreatorPayoutDecision, CreatorPayoutInput } from "./types";

export function decideCreatorPayout(input: CreatorPayoutInput): CreatorPayoutDecision {
  if (!input.fiatBridgeAllowed) {
    return {
      payable: false,
      creatorAmount: 0,
      platformAmount: 0,
      reason: "fiat_bridge_not_allowed"
    };
  }

  if (!input.fraudCleared) {
    return {
      payable: false,
      creatorAmount: 0,
      platformAmount: 0,
      reason: "fraud_not_cleared"
    };
  }

  if (!validSplit(input.creatorShare, input.platformShare)) {
    return {
      payable: false,
      creatorAmount: 0,
      platformAmount: 0,
      reason: "invalid_creator_majority_split"
    };
  }

  const gross = Math.max(0, input.grossAmount);

  return {
    payable: gross > 0,
    creatorAmount: roundMoney(gross * input.creatorShare),
    platformAmount: roundMoney(gross * input.platformShare),
    reason: gross > 0 ? "payable" : "zero_amount"
  };
}

function validSplit(creatorShare: number, platformShare: number): boolean {
  return Math.abs(creatorShare + platformShare - 1) < 0.0001 && creatorShare >= 0.6 && platformShare <= 0.4;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
