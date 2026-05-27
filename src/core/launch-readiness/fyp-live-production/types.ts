export type ProductionValidationStatus = "PASS" | "WARNING" | "FAILED";

export interface FypProductionCapability {
  name: string;
  feedAssembly: boolean;
  rankingRuntime: boolean;
  personalizationRuntime: boolean;
  diversityRuntime: boolean;
  dedupeRuntime: boolean;
  latencyCeilingMs: number;
  preloadSafe: boolean;
  fallbackReady: boolean;
  observabilityReady: boolean;
}

export interface LiveProductionCapability {
  name: string;
  roomLifecycle: boolean;
  eventIngestion: boolean;
  presenceRuntime: boolean;
  moderationFlow: boolean;
  replaySafety: boolean;
  observabilityReady: boolean;
  telemetryReady: boolean;
  recoveryReady: boolean;
  edgeCaseCoverage: boolean;
}

export interface ProductionFinding {
  system: "fyp" | "live";
  capability: string;
  status: ProductionValidationStatus;
  message: string;
  requiredFix?: string;
}

export interface FypLiveProductionReport {
  generatedAt: string;
  status: ProductionValidationStatus;
  fypStatus: ProductionValidationStatus;
  liveStatus: ProductionValidationStatus;
  failedFindings: number;
  warningFindings: number;
  findings: ProductionFinding[];
}
