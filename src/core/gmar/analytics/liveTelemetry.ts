export function liveTelemetry(latency: number) {
  return {
    healthy: latency < 120
  };
}
