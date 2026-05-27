import {
  createGmarRequestSignature,
  evaluateGmarSecurityRequest,
  assertGmarSecurityDecision
} from "@/src/core/gmar/final-completion/security/antiCheat";

describe("GMAR Final Completion Phase 08 — Anti-Cheat + Abuse Protection", () => {
  it("allows valid signed request", () => {
    const signature = createGmarRequestSignature({
      playerId: "gmar_user_001",
      action: "reward_claim",
      requestId: "req_001"
    });

    const decision = evaluateGmarSecurityRequest({
      request: {
        playerId: "gmar_user_001",
        action: "reward_claim",
        requestId: "req_001",
        timestamp: Date.now(),
        signature,
        cooldownKey: "cooldown_001",
        amount: 10
      },
      previousCooldownKeys: [],
      maxAmount: 50
    });

    expect(decision.allowed).toBe(true);
    expect(decision.signed).toBe(true);
    expect(decision.cooldownValid).toBe(true);
    expect(decision.amountValid).toBe(true);
    expect(decision.suspicious).toBe(false);
    expect(assertGmarSecurityDecision(decision)).toBe(true);
  });

  it("blocks invalid signature", () => {
    const decision = evaluateGmarSecurityRequest({
      request: {
        playerId: "gmar_user_001",
        action: "xp_gain",
        requestId: "req_002",
        timestamp: Date.now(),
        signature: "bad_signature",
        cooldownKey: "cooldown_002",
        amount: 10
      }
    });

    expect(decision.allowed).toBe(false);
    expect(decision.suspicious).toBe(true);
  });

  it("blocks repeated cooldown key", () => {
    const signature = createGmarRequestSignature({
      playerId: "gmar_user_001",
      action: "inventory_grant",
      requestId: "req_003"
    });

    const decision = evaluateGmarSecurityRequest({
      request: {
        playerId: "gmar_user_001",
        action: "inventory_grant",
        requestId: "req_003",
        timestamp: Date.now(),
        signature,
        cooldownKey: "cooldown_dup",
        amount: 1
      },
      previousCooldownKeys: ["cooldown_dup"]
    });

    expect(decision.allowed).toBe(false);
    expect(decision.cooldownValid).toBe(false);
  });

  it("blocks unsafe amount", () => {
    const signature = createGmarRequestSignature({
      playerId: "gmar_user_001",
      action: "economy_spend",
      requestId: "req_004"
    });

    const decision = evaluateGmarSecurityRequest({
      request: {
        playerId: "gmar_user_001",
        action: "economy_spend",
        requestId: "req_004",
        timestamp: Date.now(),
        signature,
        cooldownKey: "cooldown_004",
        amount: 999
      },
      maxAmount: 100
    });

    expect(decision.allowed).toBe(false);
    expect(decision.amountValid).toBe(false);
  });
});
