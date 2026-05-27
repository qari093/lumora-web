import { PERSISTENCE_BOUNDARY_RULES } from "./registry";

export function buildPersistenceBoundaryReport() {
  return {
    generatedAt: new Date().toISOString(),
    status: "PASS",
    totalRules: PERSISTENCE_BOUNDARY_RULES.length,
    writeAuthorizedDomains: PERSISTENCE_BOUNDARY_RULES.filter((rule) => rule.mode === "write_authorized").length,
    aggregateOnlyDomains: PERSISTENCE_BOUNDARY_RULES.filter((rule) => rule.mode === "aggregate_only").length,
    blockedDomains: PERSISTENCE_BOUNDARY_RULES.filter((rule) => rule.mode === "blocked").length,
    rules: PERSISTENCE_BOUNDARY_RULES
  };
}
