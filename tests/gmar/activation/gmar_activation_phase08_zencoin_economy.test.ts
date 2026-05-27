import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  createGmarZencoinWallet,
  claimGmarZencoinReward,
  assertGmarZencoinClaim
} from "@/src/core/gmar/economy-active/zencoin";

describe("GMAR Activation Phase 08 — Zencoin Economy", () => {
  it("creates wallet and claims Zencoin reward", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const wallet = createGmarZencoinWallet({
      playerId: state.player.playerId,
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const result = claimGmarZencoinReward({
      state,
      wallet,
      amount: 10,
      reason: "First mission reward",
      claimKey: "claim_first_signal_zencoin",
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(result.wallet.balance).toBe(10);
    expect(result.wallet.earnedTotal).toBe(10);
    expect(result.ledgerEntry.type).toBe("zencoin");
    expect(result.ledgerEntry.amount).toBe(10);

    expect(assertGmarZencoinClaim(result)).toBe(true);
  });

  it("rejects duplicate claim", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const first = claimGmarZencoinReward({
      state,
      amount: 5,
      reason: "First reward",
      claimKey: "dup_claim"
    });

    expect(() =>
      claimGmarZencoinReward({
        state: first.state,
        wallet: first.wallet,
        amount: 5,
        reason: "First reward",
        claimKey: "dup_claim"
      })
    ).toThrow("GMAR Zencoin reward already claimed.");
  });

  it("rejects unsafe reward amount", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      claimGmarZencoinReward({
        state,
        amount: 999,
        reason: "Unsafe reward",
        claimKey: "unsafe"
      })
    ).toThrow(
      "GMAR Zencoin reward amount must be between 1 and 50."
    );
  });
});
