export type AbuseCheckInput = {
  repeatedReports?: number;
  suspiciousClicks?: number;
  rapidSubmissions?: number;
  botScore?: number;
};

export type AbuseCheckResult = {
  blocked: boolean;
  score: number;
  level: "low" | "medium" | "high";
  recommendation: "allow" | "review" | "block";
};

export function evaluateAbuse(input: AbuseCheckInput): AbuseCheckResult {
  const repeatedReports = Math.max(0, input.repeatedReports ?? 0);
  const suspiciousClicks = Math.max(0, input.suspiciousClicks ?? 0);
  const rapidSubmissions = Math.max(0, input.rapidSubmissions ?? 0);
  const botScore = Math.max(0, Math.min(1, input.botScore ?? 0));

  let score = 0;
  score += Math.min(0.30, repeatedReports * 0.05);
  score += Math.min(0.25, suspiciousClicks * 0.03);
  score += Math.min(0.25, rapidSubmissions * 0.04);
  score += Math.min(0.20, botScore * 0.20);

  const normalized = Math.max(0, Math.min(1, Number(score.toFixed(4))));

  if (normalized >= 0.75) {
    return {
      blocked: true,
      score: normalized,
      level: "high",
      recommendation: "block",
    };
  }

  if (normalized >= 0.4) {
    return {
      blocked: false,
      score: normalized,
      level: "medium",
      recommendation: "review",
    };
  }

  return {
    blocked: false,
    score: normalized,
    level: "low",
    recommendation: "allow",
  };
}
