import type { FinalReadinessInput, FinalReadinessReport } from "./types";

export function runFinalCreatorAlchemyReadiness(input: FinalReadinessInput): FinalReadinessReport {
  const checks: Record<string, boolean> = {
    emotionalDensitySafe: input.emotionalDensitySafe,
    atmosphereTuned: input.atmosphereTuned,
    whisperRaritySafe: input.whisperRaritySafe,
    dreamCadenceSafe: input.dreamCadenceSafe,
    economyPacingSafe: input.economyPacingSafe,
    fypSyncSafe: input.fypSyncSafe,
    creatorTrustSafe: input.creatorTrustSafe,
    costControlsSafe: input.costControlsSafe,
    humanRealityReady: input.humanRealityReady
  };

  const passed = Object.entries(checks).filter(([, ok]) => ok).map(([key]) => key);
  const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);

  return {
    ok: failed.length === 0,
    status: failed.length === 0 ? "POST_SEAL_READY" : "BLOCKED",
    passed,
    failed
  };
}

export function buildDefaultFinalReadinessReport(): FinalReadinessReport {
  return runFinalCreatorAlchemyReadiness({
    emotionalDensitySafe: true,
    atmosphereTuned: true,
    whisperRaritySafe: true,
    dreamCadenceSafe: true,
    economyPacingSafe: true,
    fypSyncSafe: true,
    creatorTrustSafe: true,
    costControlsSafe: true,
    humanRealityReady: true
  });
}
