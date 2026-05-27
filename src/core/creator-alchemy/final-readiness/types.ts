export interface FinalReadinessInput {
  emotionalDensitySafe: boolean;
  atmosphereTuned: boolean;
  whisperRaritySafe: boolean;
  dreamCadenceSafe: boolean;
  economyPacingSafe: boolean;
  fypSyncSafe: boolean;
  creatorTrustSafe: boolean;
  costControlsSafe: boolean;
  humanRealityReady: boolean;
}

export interface FinalReadinessReport {
  ok: boolean;
  status: "POST_SEAL_READY" | "BLOCKED";
  passed: string[];
  failed: string[];
}
