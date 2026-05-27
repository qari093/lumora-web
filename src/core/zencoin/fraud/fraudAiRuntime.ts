export const fraudAiRuntime = {
  anomalyDetection: true,
  fraudScoring: true,
  behaviorAnalytics: true,
  refundAbuseDetection: true,
  trustScoring: true,
  realtimeAlerts: true
};

export function fraudAiHealthy(): boolean {
  return Object.values(fraudAiRuntime).every(Boolean);
}
