import { calculateAnomalyScore, FraudSignalProfile } from "./anomaly";
import { resolveFraudEscalation } from "./escalation";
import { validateMicroInteractionProof } from "./microProof";
import { scorePatternRisk } from "./patternScore";

export function evaluateFraudPrevention(input: {
  profile: FraudSignalProfile;
  persistentFlags: number;
  microHoldMs?: number;
  pattern: {
    identicalIntervals: number;
    totalEvents: number;
    uniqueDevices: number;
    uniqueUsers: number;
  };
}) {
  const anomalyScore = calculateAnomalyScore(input.profile);
  const patternRisk = scorePatternRisk(input.pattern);
  const escalation = resolveFraudEscalation({
    anomalyScore: Math.max(anomalyScore, patternRisk),
    persistentFlags: input.persistentFlags,
  });

  const proof =
    escalation.level === "none"
      ? { ok: true, proofType: "not_required" as const }
      : validateMicroInteractionProof({ holdMs: input.microHoldMs ?? 0 });

  return {
    ok: escalation.level === "none" || proof.ok,
    anomalyScore,
    patternRisk,
    escalation,
    proof,
  };
}
