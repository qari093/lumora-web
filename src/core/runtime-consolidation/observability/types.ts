export type ObservabilityStatus = "healthy" | "warning" | "critical";

export interface ObservabilityMetric {
  key: string;
  value: number;
  status: ObservabilityStatus;
  threshold?: number;
}

export interface RuntimeObservabilityReport {
  generatedAt: string;
  status: ObservabilityStatus;
  routeCount: number;
  apiRouteCount: number;
  pageRouteCount: number;
  unknownDomainRoutes: number;
  duplicateFindings: number;
  highRiskDuplicates: number;
  deprecatedAliases: number;
  orchestratorCount: number;
  eventBusReady: boolean;
  persistenceBoundaryReady: boolean;
  activationReady: boolean;
  metrics: ObservabilityMetric[];
}
