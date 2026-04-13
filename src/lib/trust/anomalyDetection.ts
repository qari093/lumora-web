export type AnomalyDetectionResult = {
  signalId: string;
  anomalyScore: number;
  isAnomalous: boolean;
  reasons: string[];
};

function toNum(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function detectAnomaly(signal: any): AnomalyDetectionResult {
  const reasons: string[] = [];
  let score = 0;

  const velocity = toNum(signal.velocityScore);
  const attention = toNum(signal.attentionScore);
  const saturation = toNum(signal.saturationScore);
  const weighted = toNum(signal.weightedScore);
  const gravity = toNum(signal.gravityScore);
  const trailerPriority = toNum(signal.trailerPriorityScore);

  if (velocity >= 90 && attention <= 20) {
    reasons.push("velocity_attention_divergence");
    score += 25;
  }

  if (gravity >= 85 && weighted <= 15) {
    reasons.push("gravity_weight_mismatch");
    score += 20;
  }

  if (saturation >= 85 && velocity >= 85) {
    reasons.push("high_saturation_high_velocity_conflict");
    score += 20;
  }

  if (trailerPriority >= 80 && !(String(signal.title || "").toLowerCase().includes("trailer") || String(signal.summary || "").toLowerCase().includes("trailer"))) {
    reasons.push("trailer_priority_without_trailer_terms");
    score += 15;
  }

  if (velocity === 0 && attention >= 70) {
    reasons.push("attention_without_velocity");
    score += 15;
  }

  if (weighted > 100 || gravity > 100) {
    reasons.push("score_out_of_bounds");
    score += 30;
  }

  return {
    signalId: String(signal.id || "unknown"),
    anomalyScore: score,
    isAnomalous: score >= 30,
    reasons,
  };
}

export function detectAnomalies(signals: any[]): AnomalyDetectionResult[] {
  return (Array.isArray(signals) ? signals : []).map(detectAnomaly);
}
