export type FinalSealStatus = "PASS" | "WARNING" | "FAILED";

export interface InfrastructureCapability {
  name: string;
  required: boolean;
  ready: boolean;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
}

export interface FinalSealInput {
  requiredLocks: string[];
  infrastructure: InfrastructureCapability[];
}

export interface FinalSealFinding {
  area: string;
  status: FinalSealStatus;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  requiredFix?: string;
}

export interface FinalLaunchSealReport {
  generatedAt: string;
  status: FinalSealStatus;
  missingLocks: string[];
  totalInfrastructureChecks: number;
  failedFindings: number;
  warningFindings: number;
  findings: FinalSealFinding[];
  certification: {
    sealed: boolean;
    launchReady: boolean;
    mode: "private_beta" | "blocked";
  };
}
