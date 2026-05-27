export function createObservabilityRuntime() {
  return {
    telemetry: true,
    rollback: true,
    tracing: true
  };
}
