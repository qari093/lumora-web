export type ContractSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ContractStatus =
  | "PASS"
  | "WARNING"
  | "FAILED";

export interface ApiContractRule {
  id: string;
  name: string;
  required: boolean;
  description: string;
}

export interface ApiContractInspection {
  route: string;
  domain: string;
  hasRequestId: boolean;
  hasStableEnvelope: boolean;
  hasSafeErrors: boolean;
  hasVersioning: boolean;
  hasTypedMeta: boolean;
  severity: ContractSeverity;
  status: ContractStatus;
  missing: string[];
}

export interface ApiContractHardeningReport {
  generatedAt: string;
  status: ContractStatus;
  totalRoutes: number;
  passedRoutes: number;
  warningRoutes: number;
  failedRoutes: number;
  inspections: ApiContractInspection[];
}
