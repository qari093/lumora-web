export type PersistenceCheckStatus = "PASS" | "WARNING" | "FAILED";
export type PersistenceRisk = "none" | "low" | "medium" | "high" | "critical";

export interface PersistenceTarget {
  name: string;
  domain: string;
  requiresPersistentWrite: boolean;
  requiresIdempotency: boolean;
  requiresRollback: boolean;
  requiresRecovery: boolean;
}

export interface PersistenceIntegrityFinding {
  target: string;
  domain: string;
  risk: PersistenceRisk;
  status: PersistenceCheckStatus;
  message: string;
  requiredFix?: string;
}

export interface RecoveryCheck {
  name: string;
  domain: string;
  supportsSnapshot: boolean;
  supportsReplay: boolean;
  supportsRollback: boolean;
  supportsFallback: boolean;
  status: PersistenceCheckStatus;
}

export interface PersistenceStateIntegrityReport {
  generatedAt: string;
  status: PersistenceCheckStatus;
  totalTargets: number;
  failedTargets: number;
  warningTargets: number;
  recoveryChecks: RecoveryCheck[];
  findings: PersistenceIntegrityFinding[];
}
