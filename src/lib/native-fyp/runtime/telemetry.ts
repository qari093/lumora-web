export function buildTelemetryPayload(events: any[]) {
  return {
    count: events.length,
    ts: Date.now(),
  };
}
