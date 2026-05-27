import type { CreatorEconomyRuntime } from "./types";
import { calculateZenEconomyBalance } from "./ledger";

export function buildCreatorEconomyRuntime(input: {
  creatorId: string;
  fraudCleared: boolean;
  creatorVerified: boolean;
  commerceSafetyPassed: boolean;
}): CreatorEconomyRuntime {
  const balance = calculateZenEconomyBalance(input.creatorId);

  return {
    creatorId: input.creatorId,
    balance,
    payoutEligible: balance >= 1000 && input.fraudCleared && input.creatorVerified,
    patronageEligible: input.fraudCleared && input.creatorVerified,
    storefrontEligible: input.creatorVerified && input.commerceSafetyPassed
  };
}
