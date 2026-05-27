export type GcmStatus = "PASS" | "WARNING" | "FAILED";
export type GcmSystem = "gmar" | "creator" | "monetization";

export interface GcmCapability {
  system: GcmSystem;
  capability: string;
  required: boolean;
  ready: boolean;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
}

export interface GcmFinding {
  system: GcmSystem;
  capability: string;
  status: GcmStatus;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  requiredFix?: string;
}

export interface GmarCreatorMonetizationReport {
  generatedAt: string;
  status: GcmStatus;
  totalCapabilities: number;
  failedFindings: number;
  warningFindings: number;
  gmarStatus: GcmStatus;
  creatorStatus: GcmStatus;
  monetizationStatus: GcmStatus;
  findings: GcmFinding[];
}
