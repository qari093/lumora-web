import { createAttentionProofBase } from "./attentionBase";
import { createRewardExpansionHook } from "./rewardHooks";
import { createMarketplacePlaceholder } from "./marketplace";
import { validateAcpFutureFlags } from "./futureFlags";

export function validateEvolutionHooks() {
  const proof = createAttentionProofBase({
    userId: "u1",
    sessionId: "s1",
    attentionQuality: 0.7,
    generatedAt: 1,
  });

  const rewardHook = createRewardExpansionHook({
    hookId: "h1",
    rewardType: "attention_credit",
    enabled: false,
  });

  const marketplace = createMarketplacePlaceholder({
    marketId: "m1",
    type: "attention_queue",
  });

  const flagsSafe = validateAcpFutureFlags();

  return {
    ok:
      proof.valid &&
      rewardHook.futureReady &&
      marketplace.active === false &&
      flagsSafe,
    proof,
    rewardHook,
    marketplace,
    flagsSafe,
  };
}
