export type DeviceTier = "low" | "mid" | "high";
export type ShaderMode = "flat" | "lite" | "full";

export type DeviceAdaptationProfile = {
  tier: DeviceTier;
  shaderMode: ShaderMode;
  videoAutoplay: boolean;
  particleBudget: number;
  prefetchSignals: number;
};

export type RuntimeBudget = {
  maxInitialPayloadKb: number;
  maxFrameMs: number;
  maxMemoryMb: number;
  lowBandwidth: boolean;
};

export type PerformanceAudit = {
  profile: DeviceAdaptationProfile;
  budget: RuntimeBudget;
  pass: boolean;
};
