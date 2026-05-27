import type { EchoCandidate, EchoTelemetry, EchoType } from "./types";

function clamp(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function scoreEchoTelemetry(input: EchoTelemetry): number {
  const nearFailure =
    input.nearFailureDeltaMs > 0 && input.nearFailureDeltaMs <= 1000 ? 30 : 0;

  const coordination = clamp(input.coordinationScore, 0, 1) * 25;
  const rarity = input.rarityPercent > 0 && input.rarityPercent <= 0.5 ? 20 : 0;
  const emotionalArc = clamp(input.emotionalArcQuality, 0, 1) * 15;
  const social = clamp(input.socialAcknowledgmentScore, 0, 1) * 10;

  return Math.round(nearFailure + coordination + rarity + emotionalArc + social);
}

export function inferEchoType(input: EchoTelemetry): EchoType {
  if (input.coordinationScore >= 0.85) return "sync";
  if (input.nearFailureDeltaMs > 0 && input.nearFailureDeltaMs <= 500) return "last_breath";
  if (input.rarityPercent > 0 && input.rarityPercent <= 0.2) return "civilization";
  return "redemption";
}

export function createEchoCandidate(input: EchoTelemetry): EchoCandidate {
  const score = scoreEchoTelemetry(input);

  const reasons = [
    input.nearFailureDeltaMs <= 1000 ? "near_failure" : "",
    input.coordinationScore >= 0.7 ? "coordination" : "",
    input.rarityPercent <= 0.5 ? "rarity" : "",
    input.emotionalArcQuality >= 0.6 ? "emotional_arc" : "",
    input.socialAcknowledgmentScore >= 0.5 ? "social_acknowledgment" : "",
  ].filter(Boolean);

  return {
    score,
    eligible: score >= 75,
    type: inferEchoType(input),
    reasons,
  };
}
