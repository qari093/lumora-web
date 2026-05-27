export function crossPortalTelemetry(event: string) {
  return {
    event,
    domain: "cross-portal",
    tracked: true
  };
}
