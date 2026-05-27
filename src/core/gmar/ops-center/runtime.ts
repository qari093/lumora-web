export function opsCenterHealthy() {
  return {
    incidentDashboardReady: true,
    liveEventControlsReady: true,
    economyReviewReady: true,
    safetyEscalationReady: true,
  };
}

export function resolveIncidentSeverity(input: { affectedUsers: number; safetyRisk: boolean }): "low" | "medium" | "critical" {
  if (input.safetyRisk || input.affectedUsers >= 1000) return "critical";
  if (input.affectedUsers >= 100) return "medium";
  return "low";
}
