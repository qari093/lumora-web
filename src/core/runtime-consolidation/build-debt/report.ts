import type { BuildDebtBudget, BuildDebtCategory, BuildDebtFinding, BuildDebtReport } from "./types";

export const DEFAULT_BUILD_DEBT_BUDGET: BuildDebtBudget = {
  maxCritical: 0,
  maxHigh: 25,
  maxMedium: 80,
  maxTotal: 250
};

const EMPTY_CATEGORY_COUNTS: Record<BuildDebtCategory, number> = {
  react_hooks: 0,
  unused_symbol: 0,
  unused_eslint_disable: 0,
  prerender: 0,
  import_export: 0,
  runtime_warning: 0,
  unknown: 0
};

const EMPTY_SEVERITY_COUNTS: Record<BuildDebtFinding["severity"], number> = {
  low: 0,
  medium: 0,
  high: 0,
  critical: 0
};

export function buildBuildDebtReport(
  findings: BuildDebtFinding[],
  budget: BuildDebtBudget = DEFAULT_BUILD_DEBT_BUDGET
): BuildDebtReport {
  const byCategory = { ...EMPTY_CATEGORY_COUNTS };
  const bySeverity = { ...EMPTY_SEVERITY_COUNTS };

  for (const finding of findings) {
    byCategory[finding.category] += 1;
    bySeverity[finding.severity] += 1;
  }

  const status =
    bySeverity.critical > budget.maxCritical ||
    bySeverity.high > budget.maxHigh ||
    bySeverity.medium > budget.maxMedium ||
    findings.length > budget.maxTotal
      ? "FAILED"
      : findings.length > 0
        ? "WARNING"
        : "PASS";

  return {
    generatedAt: new Date().toISOString(),
    status,
    totalFindings: findings.length,
    byCategory,
    bySeverity,
    budget,
    findings
  };
}

export function buildCurrentBuildDebtBaseline(): BuildDebtReport {
  return buildBuildDebtReport([]);
}
