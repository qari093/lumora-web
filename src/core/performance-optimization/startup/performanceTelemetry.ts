export function performanceTelemetry(metric: string, value: number) {
  return {
    metric,
    value,
    tracked: true
  };
}
