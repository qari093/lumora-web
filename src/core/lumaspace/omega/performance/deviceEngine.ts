import type { DeviceAdaptationProfile } from "./types";

export function createDeviceAdaptationProfile(input: {
  memoryGb: number;
  lowBandwidth?: boolean;
}): DeviceAdaptationProfile {
  const tier = input.memoryGb >= 6 ? "high" : input.memoryGb >= 3 ? "mid" : "low";

  return {
    tier,
    shaderMode: tier === "high" ? "full" : tier === "mid" ? "lite" : "flat",
    videoAutoplay: tier !== "low" && !input.lowBandwidth,
    particleBudget: tier === "high" ? 240 : tier === "mid" ? 120 : 40,
    prefetchSignals: input.lowBandwidth ? 1 : tier === "high" ? 8 : 3,
  };
}
