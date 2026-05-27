export function discoveryTelemetry(event: string) {
  return { event, domain: "fyp-discovery", safe: true };
}
