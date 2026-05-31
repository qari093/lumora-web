export type PulseMetricKind = "bridges" | "lights" | "missions" | "wisdom" | "chronicles" | "safety";

export type CivilizationMetric = {
  kind: PulseMetricKind;
  value: number;
  healthy: boolean;
};

export type CivilizationPulse = {
  communityId: string;
  metrics: CivilizationMetric[];
  healthScore: number;
  status: "healthy" | "watch" | "critical";
};

export type ObservabilityEvent = {
  id: string;
  system: "lumaspace_omega";
  severity: "info" | "warn" | "error";
  message: string;
};
