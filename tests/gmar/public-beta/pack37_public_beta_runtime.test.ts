import { describe, expect, it } from "vitest";
import { publicBetaRuntimeHealthy, resolveBetaCohort } from "../../../src/core/gmar/public-beta/runtime";

describe("GMAR Pack 37/40 — Public Beta Runtime", () => {
  it("validates public beta runtime", () => {
    const runtime = publicBetaRuntimeHealthy();

    expect(runtime.accessGateReady).toBe(true);
    expect(runtime.feedbackLoopReady).toBe(true);
    expect(runtime.rollbackSafe).toBe(true);
  });

  it("resolves beta cohorts", () => {
    expect(resolveBetaCohort(50)).toBe("founder");
    expect(resolveBetaCohort(500)).toBe("early");
    expect(resolveBetaCohort(5000)).toBe("standard");
  });
});
