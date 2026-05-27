export function evaluateTrafficHealth(input: {
  apiLatencyMs: number;
  dbLoadPercent: number;
  queueDepth: number;
  cdnUsageGb: number;
}) {
  return {
    healthy:
      input.apiLatencyMs < 500 &&
      input.dbLoadPercent < 80 &&
      input.queueDepth < 1000 &&
      input.cdnUsageGb >= 0,
    checkedAt: new Date().toISOString(),
  };
}
