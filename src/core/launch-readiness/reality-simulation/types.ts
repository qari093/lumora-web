export type SimulationRiskKind =
  | "memory_only_state"
  | "mock_runtime"
  | "demo_only_runtime"
  | "placeholder_runtime"
  | "fake_success"
  | "stubbed_integration"
  | "non_persistent_wallet"
  | "non_persistent_commerce"
  | "non_persistent_media"
  | "dead_orchestration"
  | "unknown";

export type SimulationRiskSeverity = "low" | "medium" | "high" | "critical";

export interface SimulationRiskFinding {
  file: string;
  kind: SimulationRiskKind;
  severity: SimulationRiskSeverity;
  evidence: string;
  recommendation: string;
}

export interface RealityEnforcementDecision {
  runtime: string;
  allowed: boolean;
  reason: string;
  requiredFix?: string;
}

export interface RealitySimulationReport {
  generatedAt: string;
  status: "PASS" | "WARNING" | "FAILED";
  scannedFiles: number;
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  findings: SimulationRiskFinding[];
  enforcement: RealityEnforcementDecision[];
}
