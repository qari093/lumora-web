import {
  GMAR_ACTIVATION_PHASE01_AUDIT,
  assertGmarActivationPhase01Audit
} from "@/src/core/gmar/activation/phase01Audit";

describe("GMAR Activation Phase 01 — Audit Current Stub Architecture", () => {
  it("marks GMAR as stubbed, not playable yet", () => {
    expect(GMAR_ACTIVATION_PHASE01_AUDIT.architectureStatus).toBe("STUBBED_NOT_PLAYABLE");
    expect(GMAR_ACTIVATION_PHASE01_AUDIT.newArchitectureFrozen).toBe(true);
    expect(GMAR_ACTIVATION_PHASE01_AUDIT.activationOpened).toBe(true);
    expect(GMAR_ACTIVATION_PHASE01_AUDIT.requiredLocksCount).toBe(15);
  });

  it("asserts phase 01 audit seal", () => {
    expect(assertGmarActivationPhase01Audit()).toBe(true);
  });
});
