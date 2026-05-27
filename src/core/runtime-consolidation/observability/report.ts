import { buildRouteInventoryReport, scanRuntimeRoutes } from "../routeInventory";
import { auditDuplicateResponsibilities } from "../duplicateResponsibilityAudit";
import { buildRuntimeDeprecationReport } from "../deprecation";
import { buildCanonicalOrchestratorReport } from "../orchestrators";
import { buildUnifiedEventBusReport } from "../event-bus";
import { buildPersistenceBoundaryReport } from "../persistence-boundary";
import { buildRuntimeActivationReport } from "../activation";
import type { ObservabilityMetric, RuntimeObservabilityReport } from "./types";
import { metricStatus, worstStatus } from "./status";

export function buildRuntimeObservabilityReport(): RuntimeObservabilityReport {
  const inventory = buildRouteInventoryReport(scanRuntimeRoutes());
  const duplicateAudit = auditDuplicateResponsibilities(inventory.routes);
  const deprecations = buildRuntimeDeprecationReport();
  const orchestrators = buildCanonicalOrchestratorReport();
  const eventBus = buildUnifiedEventBusReport();
  const persistence = buildPersistenceBoundaryReport();
  const activation = buildRuntimeActivationReport();

  const metrics: ObservabilityMetric[] = [
    {
      key: "unknown_domain_routes",
      value: inventory.summary.unknownDomainRoutes,
      status: metricStatus(inventory.summary.unknownDomainRoutes, 250, 700),
      threshold: 250
    },
    {
      key: "high_risk_duplicate_findings",
      value: duplicateAudit.highRiskCount,
      status: metricStatus(duplicateAudit.highRiskCount, 50, 150),
      threshold: 50
    },
    {
      key: "deprecated_aliases",
      value: deprecations.total,
      status: metricStatus(deprecations.total, 10, 25),
      threshold: 10
    },
    {
      key: "orchestrator_count",
      value: orchestrators.orchestratorCount,
      status: orchestrators.orchestratorCount >= 16 ? "healthy" : "critical",
      threshold: 16
    },
    {
      key: "event_bus_ready",
      value: eventBus.status === "PASS" ? 1 : 0,
      status: eventBus.status === "PASS" ? "healthy" : "critical",
      threshold: 1
    },
    {
      key: "persistence_boundary_ready",
      value: persistence.status === "PASS" ? 1 : 0,
      status: persistence.status === "PASS" ? "healthy" : "critical",
      threshold: 1
    },
    {
      key: "activation_ready",
      value: activation.status === "PASS" ? 1 : 0,
      status: activation.status === "PASS" ? "healthy" : "critical",
      threshold: 1
    }
  ];

  return {
    generatedAt: new Date().toISOString(),
    status: worstStatus(metrics),
    routeCount: inventory.summary.total,
    apiRouteCount: inventory.summary.apiRoutes,
    pageRouteCount: inventory.summary.pageRoutes,
    unknownDomainRoutes: inventory.summary.unknownDomainRoutes,
    duplicateFindings: duplicateAudit.findingCount,
    highRiskDuplicates: duplicateAudit.highRiskCount,
    deprecatedAliases: deprecations.total,
    orchestratorCount: orchestrators.orchestratorCount,
    eventBusReady: eventBus.status === "PASS",
    persistenceBoundaryReady: persistence.status === "PASS",
    activationReady: activation.status === "PASS",
    metrics
  };
}
