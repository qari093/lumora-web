import type { FypProductionCapability, LiveProductionCapability } from "./types";

export const FYP_PRODUCTION_CAPABILITY: FypProductionCapability = {
  name: "canonical_fyp_runtime",
  feedAssembly: true,
  rankingRuntime: true,
  personalizationRuntime: true,
  diversityRuntime: true,
  dedupeRuntime: true,
  latencyCeilingMs: 220,
  preloadSafe: true,
  fallbackReady: true,
  observabilityReady: true
};

export const LIVE_PRODUCTION_CAPABILITY: LiveProductionCapability = {
  name: "canonical_live_runtime",
  roomLifecycle: true,
  eventIngestion: true,
  presenceRuntime: true,
  moderationFlow: true,
  replaySafety: true,
  observabilityReady: true,
  telemetryReady: true,
  recoveryReady: false,
  edgeCaseCoverage: true
};
