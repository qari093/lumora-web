import { createDeviceAdaptationProfile } from "./deviceEngine";
import { createRuntimeBudget } from "./budgetEngine";
import { createPerformanceAudit } from "./auditEngine";

export function runLumaSpaceOmegaMegaPack24Runtime() {
  const low = createDeviceAdaptationProfile({ memoryGb: 2, lowBandwidth: true });
  const budget = createRuntimeBudget(low);
  const audit = createPerformanceAudit(low, budget);

  return {
    ok:
      low.tier === "low" &&
      low.shaderMode === "flat" &&
      low.videoAutoplay === false &&
      budget.lowBandwidth &&
      audit.pass,
    low,
    budget,
    audit,
  };
}
