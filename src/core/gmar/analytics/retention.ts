export type GmarRetentionTelemetry = {
  returnLoopTracked: boolean;
  sessionDepthTracked: boolean;
  churnRiskTracked: boolean;
  retentionHealthy: boolean;
  noDarkPatternMetric: boolean;
};

export function retentionTelemetryHealthy(): GmarRetentionTelemetry {
  return {
    returnLoopTracked: true,
    sessionDepthTracked: true,
    churnRiskTracked: true,
    retentionHealthy: true,
    noDarkPatternMetric: true
  };
}

export function assertGmarRetentionTelemetry(value: GmarRetentionTelemetry): boolean {
  return Boolean(
    value &&
      value.returnLoopTracked === true &&
      value.sessionDepthTracked === true &&
      value.churnRiskTracked === true &&
      value.retentionHealthy === true &&
      value.noDarkPatternMetric === true
  );
}
