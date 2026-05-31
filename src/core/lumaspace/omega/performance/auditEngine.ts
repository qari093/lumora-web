import type { DeviceAdaptationProfile, PerformanceAudit, RuntimeBudget } from "./types";

export function createPerformanceAudit(profile: DeviceAdaptationProfile, budget: RuntimeBudget): PerformanceAudit {
  return {
    profile,
    budget,
    pass:
      budget.maxInitialPayloadKb <= 900 &&
      budget.maxFrameMs <= 24 &&
      budget.maxMemoryMb <= 420 &&
      profile.particleBudget <= 240,
  };
}
