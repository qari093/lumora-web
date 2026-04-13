export type SemanticValidationResult = {
  signalId: string;
  semanticRiskScore: number;
  verdict: "pass" | "review" | "block";
  reasons: string[];
};

function containsAny(text: string, phrases: string[]): boolean {
  const lower = text.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

export function semanticValidateSignal(signal: any): SemanticValidationResult {
  const text = [
    String(signal.title || ""),
    String(signal.summary || ""),
    ...(Array.isArray(signal.keywords) ? signal.keywords.map(String) : []),
    ...(Array.isArray(signal.hashtags) ? signal.hashtags.map(String) : []),
  ].join(" ").toLowerCase();

  const reasons: string[] = [];
  let score = 0;

  if (containsAny(text, ["guaranteed profit", "100% win", "instant riches", "double your money"])) {
    reasons.push("financial_promise_pattern");
    score += 40;
  }

  if (containsAny(text, ["deepfake", "leaked celebrity", "secret video", "undisclosed ai"])) {
    reasons.push("deceptive_media_pattern");
    score += 30;
  }

  if (containsAny(text, ["miracle cure", "cancer cure", "instant cure", "no doctor needed"])) {
    reasons.push("medical_misinformation_pattern");
    score += 40;
  }

  if (containsAny(text, ["official trailer"]) && !containsAny(text, ["trailer", "teaser", "clip"])) {
    reasons.push("official_claim_without_support");
    score += 20;
  }

  const verdict =
    score >= 50 ? "block" :
    score >= 20 ? "review" :
    "pass";

  return {
    signalId: String(signal.id || "unknown"),
    semanticRiskScore: score,
    verdict,
    reasons,
  };
}

export function semanticValidateBatch(signals: any[]): SemanticValidationResult[] {
  return (Array.isArray(signals) ? signals : []).map(semanticValidateSignal);
}
