import { describe, expect, it } from "vitest";
import { createDeviceAdaptationProfile } from "@/src/core/lumaspace/omega/performance/deviceEngine";
import { createRuntimeBudget } from "@/src/core/lumaspace/omega/performance/budgetEngine";
import { createPerformanceAudit } from "@/src/core/lumaspace/omega/performance/auditEngine";
import { runLumaSpaceOmegaMegaPack24Runtime } from "@/src/core/lumaspace/omega/performance/omegaPack24Runtime";

describe("LumaSpace Ω∞ Mega Pack 24 — Performance Adaptation", () => {
  it("creates low device profile", () => {
    const profile = createDeviceAdaptationProfile({ memoryGb: 2, lowBandwidth: true });
    expect(profile.shaderMode).toBe("flat");
    expect(profile.videoAutoplay).toBe(false);
  });

  it("creates runtime budget", () => {
    const profile = createDeviceAdaptationProfile({ memoryGb: 4 });
    const budget = createRuntimeBudget(profile);
    expect(budget.maxInitialPayloadKb).toBeLessThanOrEqual(900);
  });

  it("creates passing audit", () => {
    const profile = createDeviceAdaptationProfile({ memoryGb: 8 });
    const audit = createPerformanceAudit(profile, createRuntimeBudget(profile));
    expect(audit.pass).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack24Runtime().ok).toBe(true);
  });
});
