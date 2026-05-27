import { calculateZenScoreDecay, calculateRecentWeightedZenScore } from "./decay";
import { calculateLegacyBonus } from "./legacy";
import { calculateStabilityReward } from "./stabilityReserve";
import { calculateZenBurn } from "./burn";

export function validateZenStabilitySystem(input: {
  currentScore: number;
  daysInactive: number;
  recentScore: number;
  historicalScore: number;
  accountAgeDays: number;
  positiveContributionDays: number;
  revenuePerUser: number;
  targetRevenuePerUser: number;
  reserveBalance: number;
  spendAmount: number;
}) {
  const decayedScore = calculateZenScoreDecay({
    currentScore: input.currentScore,
    daysInactive: input.daysInactive,
  });

  const weightedScore = calculateRecentWeightedZenScore({
    recentScore: input.recentScore,
    historicalScore: input.historicalScore,
  });

  const legacyBonus = calculateLegacyBonus({
    accountAgeDays: input.accountAgeDays,
    positiveContributionDays: input.positiveContributionDays,
  });

  const stabilityReward = calculateStabilityReward({
    revenuePerUser: input.revenuePerUser,
    targetRevenuePerUser: input.targetRevenuePerUser,
    reserveBalance: input.reserveBalance,
  });

  const burn = calculateZenBurn({
    spendAmount: input.spendAmount,
  });

  return {
    ok:
      decayedScore >= 0 &&
      weightedScore >= 0 &&
      legacyBonus >= 0 &&
      stabilityReward >= 0 &&
      burn.burned >= 0,
    decayedScore,
    weightedScore,
    legacyBonus,
    stabilityReward,
    burn,
  };
}
