import type { BetaCreatorSignal, BetaValidationReport } from "./types";

export function validatePrivateBetaCivilization(signals: readonly BetaCreatorSignal[]): BetaValidationReport {
  const creatorCount = signals.length;
  const averageTrustScore = avg(signals.map((signal) => signal.trustScore));
  const averageWhisperUsefulRate = avg(signals.map((signal) => signal.whisperUsefulRate));
  const overloadReports = signals.reduce((sum, signal) => sum + signal.emotionalOverloadReports, 0);
  const overloadSafe = overloadReports <= Math.max(2, creatorCount * 0.1);

  const reasons: string[] = [];

  if (creatorCount < 10) reasons.push("beta_creator_count_low");
  if (averageTrustScore < 0.7) reasons.push("trust_score_low");
  if (averageWhisperUsefulRate < 0.55) reasons.push("whisper_usefulness_low");
  if (!overloadSafe) reasons.push("emotional_overload_high");

  const status = reasons.length === 0 ? "healthy" : reasons.length <= 2 ? "watch" : "blocked";

  return {
    status,
    creatorCount,
    averageTrustScore,
    averageWhisperUsefulRate,
    overloadSafe,
    readyForExpandedBeta: status === "healthy",
    reasons
  };
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
