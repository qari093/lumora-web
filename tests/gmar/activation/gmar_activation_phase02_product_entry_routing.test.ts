import {
  GMAR_ACTIVATION_PHASE02_ROUTING,
  assertGmarActivationPhase02
} from "@/src/core/gmar/activation/phase02ProductEntryRouting";

describe("GMAR Activation Phase 02 — Product Entry + Routing", () => {
  it("locks GMAR route activation", () => {
    expect(GMAR_ACTIVATION_PHASE02_ROUTING.route).toBe("/gmar");
    expect(GMAR_ACTIVATION_PHASE02_ROUTING.portalEntryReady).toBe(true);
    expect(GMAR_ACTIVATION_PHASE02_ROUTING.launcherReady).toBe(true);
    expect(GMAR_ACTIVATION_PHASE02_ROUTING.navigationReady).toBe(true);
  });

  it("asserts phase 02 seal", () => {
    expect(assertGmarActivationPhase02()).toBe(true);
  });
});
