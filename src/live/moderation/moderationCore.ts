export type ModerationSeverity = "low" | "medium" | "high" | "critical";

export type ModerationSignal = {
  toxicity: number;
  harassment: number;
  escalation: number;
  culturalRisk: number;
};

export function calculateModerationSeverity(signal: ModerationSignal): ModerationSeverity {
  const score =
    signal.toxicity * 0.35 +
    signal.harassment * 0.3 +
    signal.escalation * 0.25 +
    signal.culturalRisk * 0.1;

  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}
