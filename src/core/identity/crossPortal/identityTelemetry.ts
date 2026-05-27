export function identityTelemetry(event: string) {
  return {
    event,
    domain: "identity",
    safe: true
  };
}
