export type StabilityLevel = "stable" | "watch" | "degraded" | "blocked";

export interface GovernanceSignal {
  diagnosticLanguage: number;
  guiltPressure: number;
  casinoRisk: number;
  creatorBurnoutRisk: number;
  consentRisk: number;
  manipulationRisk: number;
}

export interface InfrastructureSignal {
  batchJobLoad: number;
  cacheHitRatio: number;
  queueDepth: number;
  liveRoomLoad: number;
  runtimeCostPressure: number;
}

export interface CivilizationStabilityReport {
  level: StabilityLevel;
  governanceSafe: boolean;
  infrastructureSafe: boolean;
  reasons: string[];
}
