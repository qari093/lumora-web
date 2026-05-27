export function shouldThrottleTraffic(input: {
  apiLatencyMs: number;
  dbLoadPercent: number;
}) {
  return input.apiLatencyMs >= 800 || input.dbLoadPercent >= 90;
}
