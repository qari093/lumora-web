export function getZenWalletRuntimeTelemetry() {
  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  };
}
