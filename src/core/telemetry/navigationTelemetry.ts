export function navigationTelemetry(event: string) {
  return { event, ts: Date.now() };
}
