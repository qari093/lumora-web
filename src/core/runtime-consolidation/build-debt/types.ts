export type BuildDebtCategory =
  | "react_hooks"
  | "unused_symbol"
  | "unused_eslint_disable"
  | "prerender"
  | "import_export"
  | "runtime_warning"
  | "unknown";

export interface BuildDebtFinding {
  file: string;
  category: BuildDebtCategory;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface BuildDebtBudget {
  maxCritical: number;
  maxHigh: number;
  maxMedium: number;
  maxTotal: number;
}

export interface BuildDebtReport {
  generatedAt: string;
  status: "PASS" | "WARNING" | "FAILED";
  totalFindings: number;
  byCategory: Record<BuildDebtCategory, number>;
  bySeverity: Record<BuildDebtFinding["severity"], number>;
  budget: BuildDebtBudget;
  findings: BuildDebtFinding[];
}
