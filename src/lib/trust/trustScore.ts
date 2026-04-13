export type TrustScoreResult = {
  signalId: string;
  trustScore: number;
  trustLevel: "high" | "medium" | "low" | "blocked";
  breakdown: {
    anomaly: number;
    semantic: number;
    toxicVelocity: number;
    scam: number;
    misinformation: number;
  };
};

function toNum(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function computeTrustScore(signal: any): TrustScoreResult {
  const anomaly = toNum(signal.anomalyScore);
  const semantic = toNum(signal.semanticRiskScore);
  const toxicVelocity = toNum(signal.toxicVelocityScore);
  const scam = toNum(signal.scamScore);
  const misinformation = toNum(signal.misinformationScore);

  // Base trust starts at 100 and gets reduced by risks
  let trustScore = 100;

  trustScore -= anomaly * 0.3;
  trustScore -= semantic * 0.4;
  trustScore -= toxicVelocity * 0.5;
  trustScore -= scam * 0.6;
  trustScore -= misinformation * 0.5;

  if (trustScore < 0) trustScore = 0;
  if (trustScore > 100) trustScore = 100;

  let trustLevel: TrustScoreResult["trustLevel"] = "high";

  if (trustScore < 20) trustLevel = "blocked";
  else if (trustScore < 40) trustLevel = "low";
  else if (trustScore < 70) trustLevel = "medium";

  return {
    signalId: String(signal.id || "unknown"),
    trustScore,
    trustLevel,
    breakdown: {
      anomaly,
      semantic,
      toxicVelocity,
      scam,
      misinformation,
    },
  };
}

export function computeTrustBatch(signals: any[]): TrustScoreResult[] {
  return (Array.isArray(signals) ? signals : []).map(computeTrustScore);
}
