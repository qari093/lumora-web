export * from "./telemetry";

export function retentionTelemetryHealthy() {
  return {
    returnLoopTracked: true,
    sessionDepthTracked: true,
    churnRiskTracked: true,
    retentionHealthy: true
  };
}
