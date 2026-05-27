import { describe, expect, it } from "vitest";
import { createAttentionProofBase } from "@/src/monetization/evolution/attentionBase";
import { createRewardExpansionHook } from "@/src/monetization/evolution/rewardHooks";
import { createMarketplacePlaceholder } from "@/src/monetization/evolution/marketplace";
import { ACP_FUTURE_FLAGS, validateAcpFutureFlags } from "@/src/monetization/evolution/futureFlags";
import { validateEvolutionHooks } from "@/src/monetization/evolution/system";

describe("Monetization Pack25 — Evolution Hooks", () => {
  it("creates valid attention proof base", () => {
    const proof = createAttentionProofBase({
      userId: "u1",
      sessionId: "s1",
      attentionQuality: 0.8,
      generatedAt: 1,
    });

    expect(proof.valid).toBe(true);
  });

  it("creates future reward expansion hook", () => {
    const hook = createRewardExpansionHook({
      hookId: "h1",
      rewardType: "attention_credit",
      enabled: false,
    });

    expect(hook.futureReady).toBe(true);
  });

  it("creates inactive marketplace placeholder", () => {
    const market = createMarketplacePlaceholder({
      marketId: "m1",
      type: "creator_bond",
    });

    expect(market.active).toBe(false);
    expect(market.phase).toBe("future_acp");
  });

  it("keeps all ACP flags disabled by default", () => {
    expect(ACP_FUTURE_FLAGS.ENABLE_ATTENTION_CREDITS).toBe(false);
    expect(validateAcpFutureFlags()).toBe(true);
  });

  it("validates full evolution hook system", () => {
    const result = validateEvolutionHooks();

    expect(result.ok).toBe(true);
    expect(result.marketplace.active).toBe(false);
    expect(result.flagsSafe).toBe(true);
  });
});
