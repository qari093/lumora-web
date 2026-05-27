import { buildRewardAdOptIn } from "./optIn";
import { rewardAdCooldownPassed } from "./cooldown";
import { calculateRewardAdPayout } from "./payout";

export function evaluateRewardAdFlow(input: {
  eligible: boolean;
  userState: "green" | "yellow" | "red";
  lastRewardAdAt?: number;
  now: number;
  completed: boolean;
}) {
  const optIn = buildRewardAdOptIn({
    eligible: input.eligible,
    userState: input.userState,
  });

  const cooldownPassed = rewardAdCooldownPassed({
    lastRewardAdAt: input.lastRewardAdAt,
    now: input.now,
  });

  const canOffer = optIn.visible && cooldownPassed;
  const payout = calculateRewardAdPayout({
    completed: canOffer && input.completed,
  });

  return {
    canOffer,
    payout,
  };
}
