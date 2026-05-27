import { existsSync, writeFileSync } from "node:fs";
import type {
  RuntimeConsolidationSealInput,
  RuntimeConsolidationSealReport
} from "./types";

export const RUNTIME_CONSOLIDATION_REQUIRED_LOCKS = [
  ".lumora_runtime_consolidation_pack01_lock",
  ".lumora_runtime_consolidation_pack02_lock",
  ".lumora_runtime_consolidation_pack03_lock",
  ".lumora_runtime_consolidation_pack04_lock",
  ".lumora_runtime_consolidation_pack05_lock",
  ".lumora_runtime_consolidation_pack06_lock",
  ".lumora_runtime_consolidation_pack07_lock",
  ".lumora_runtime_consolidation_pack08_lock",
  ".lumora_runtime_consolidation_pack09_lock",
  ".lumora_runtime_consolidation_pack10_lock",
  ".lumora_runtime_consolidation_pack11_lock"
];

export const RUNTIME_CONSOLIDATION_REQUIRED_REPORTS = [
  "docs/runtime-consolidation/route_inventory_report.json",
  "docs/runtime-consolidation/domain_ownership_report.json",
  "docs/runtime-consolidation/duplicate_responsibility_audit.json",
  "docs/runtime-consolidation/canonical_orchestrator_report.json",
  "docs/runtime-consolidation/api_response_contract_report.json",
  "docs/runtime-consolidation/deprecation_migration_report.json",
  "docs/runtime-consolidation/unified_event_bus_report.json",
  "docs/runtime-consolidation/persistence_boundary_report.json",
  "docs/runtime-consolidation/runtime_activation_hierarchy_report.json",
  "docs/runtime-consolidation/observability_consolidation_report.json",
  "docs/runtime-consolidation/build_lint_debt_report.json"
];

export function collectRuntimeSealInput(): RuntimeConsolidationSealInput {
  return {
    requiredLocks: RUNTIME_CONSOLIDATION_REQUIRED_LOCKS,
    existingLocks: RUNTIME_CONSOLIDATION_REQUIRED_LOCKS.filter((lock) => existsSync(lock)),
    reports: RUNTIME_CONSOLIDATION_REQUIRED_REPORTS.filter((report) => existsSync(report))
  };
}

export function buildRuntimeConsolidationSealReport(
  input: RuntimeConsolidationSealInput = collectRuntimeSealInput()
): RuntimeConsolidationSealReport {
  const missingLocks = input.requiredLocks.filter((lock) => !input.existingLocks.includes(lock));
  const reportSet = new Set(input.reports);

  const features = {
    routeInventory: reportSet.has("docs/runtime-consolidation/route_inventory_report.json"),
    domainOwnership: reportSet.has("docs/runtime-consolidation/domain_ownership_report.json"),
    duplicateAudit: reportSet.has("docs/runtime-consolidation/duplicate_responsibility_audit.json"),
    orchestrators: reportSet.has("docs/runtime-consolidation/canonical_orchestrator_report.json"),
    apiContract: reportSet.has("docs/runtime-consolidation/api_response_contract_report.json"),
    deprecations: reportSet.has("docs/runtime-consolidation/deprecation_migration_report.json"),
    eventBus: reportSet.has("docs/runtime-consolidation/unified_event_bus_report.json"),
    persistenceBoundary: reportSet.has("docs/runtime-consolidation/persistence_boundary_report.json"),
    activationHierarchy: reportSet.has("docs/runtime-consolidation/runtime_activation_hierarchy_report.json"),
    observability: reportSet.has("docs/runtime-consolidation/observability_consolidation_report.json"),
    buildDebtControl: reportSet.has("docs/runtime-consolidation/build_lint_debt_report.json")
  };

  const allFeaturesPresent = Object.values(features).every(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    status: missingLocks.length === 0 && allFeaturesPresent ? "PASS" : "FAILED",
    totalLocks: input.requiredLocks.length,
    presentLocks: input.existingLocks.length,
    missingLocks,
    totalReports: input.reports.length,
    features,
    finalLock: ".lumora_runtime_consolidation_final_seal_lock"
  };
}

export function writeRuntimeConsolidationSealReport(path: string): RuntimeConsolidationSealReport {
  const report = buildRuntimeConsolidationSealReport();
  writeFileSync(path, JSON.stringify(report, null, 2) + "\n");
  return report;
}
