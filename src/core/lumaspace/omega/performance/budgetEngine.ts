import type { DeviceAdaptationProfile, RuntimeBudget } from "./types";

export function createRuntimeBudget(profile: DeviceAdaptationProfile): RuntimeBudget {
  return {
    maxInitialPayloadKb: profile.tier === "high" ? 900 : profile.tier === "mid" ? 650 : 420,
    maxFrameMs: profile.tier === "low" ? 24 : 16,
    maxMemoryMb: profile.tier === "high" ? 420 : profile.tier === "mid" ? 260 : 160,
    lowBandwidth: profile.prefetchSignals <= 1,
  };
}
