export type ToxicVelocityResult = {
  signalId: string;
  toxicVelocityScore: number;
  flagged: boolean;
  reasons: string[];
};

function toNum(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function textOf(signal: any): string {
  return [
    String(signal.title || ""),
    String(signal.summary || ""),
    ...(Array.isArray(signal.keywords) ? signal.keywords.map(String) : []),
    ...(Array.isArray(signal.hashtags) ? signal.hashtags.map(String) : []),
  ].join(" ").toLowerCase();
}

export function detectToxicVelocity(signal: any): ToxicVelocityResult {
  const reasons: string[] = [];
  let score = 0;

  const velocity = toNum(signal.velocityScore);
  const attention = toNum(signal.attentionScore);
  const trust = String(signal.trust || "");
  const semanticRisk = toNum(signal.semanticRiskScore);
  const anomalyScore = toNum(signal.anomalyScore);
  const botRisk = toNum(signal.botRiskScore);
  const txt = textOf(signal);

  if (velocity >= 80 && (trust === "low_trust" || trust === "toxic_velocity")) {
    reasons.push("high_velocity_low_trust");
    score += 30;
  }

  if (velocity >= 75 && semanticRisk >= 20) {
    reasons.push("high_velocity_semantic_risk");
    score += 25;
  }

  if (velocity >= 75 && botRisk >= 30) {
    reasons.push("high_velocity_bot_risk");
    score += 20;
  }

  if (velocity >= 75 && anomalyScore >= 30) {
    reasons.push("high_velocity_anomaly");
    score += 20;
  }

  if (
    velocity >= 85 &&
    attention <= 25 &&
    /(leak|scandal|shocking|outrage|nsfw|explicit|secret video|deepfake)/.test(txt)
  ) {
    reasons.push("ragebait_or_deceptive_spike");
    score += 25;
  }

  if (velocity >= 90 && attention >= 90) {
    score = Math.max(0, score - 10); // reduce false positives on genuinely huge events
  }

  return {
    signalId: String(signal.id || "unknown"),
    toxicVelocityScore: score,
    flagged: score >= 40,
    reasons,
  };
}

export function detectToxicVelocityBatch(signals: any[]): ToxicVelocityResult[] {
  return (Array.isArray(signals) ? signals : []).map(detectToxicVelocity);
}
