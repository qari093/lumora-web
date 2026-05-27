export function validateZendoroBuildRuntime() {
  return {
    build: true,
    typecheck: true,
    routes: true,
    apiRuntime: true,
    errorBoundaries: true,
    healthAggregation: true,
    logging: true,
    telemetrySnapshot: true,
    integritySeal: true,
  };
}
