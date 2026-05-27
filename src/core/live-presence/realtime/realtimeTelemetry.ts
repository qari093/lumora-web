export function realtimeTelemetry(metric: string) {
  return {
    metric,
    tracked: true
  };
}
