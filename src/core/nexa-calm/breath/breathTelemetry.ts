export function breathTelemetry(event: string) {
  return {
    event,
    domain: "nexa-calm",
    safe: true
  };
}
