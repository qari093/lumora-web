export type ScamDetectionResult = {
  signalId: string;
  scamScore: number;
  flagged: boolean;
  reasons: string[];
};

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function detectScam(signal: any): ScamDetectionResult {
  const text = [
    String(signal.title || ""),
    String(signal.summary || ""),
    ...(Array.isArray(signal.keywords) ? signal.keywords.map(String) : []),
    ...(Array.isArray(signal.hashtags) ? signal.hashtags.map(String) : []),
  ].join(" ").toLowerCase();

  const reasons: string[] = [];
  let score = 0;

  if (containsAny(text, [/guaranteed\s*profit/, /100%\s*win/, /risk[- ]?free/, /double\s*your\s*money/])) {
    reasons.push("financial_scam_pattern");
    score += 40;
  }

  if (containsAny(text, [/click\s*here/, /limited\s*time\s*offer/, /act\s*now/, /exclusive\s*deal/])) {
    reasons.push("urgency_clickbait_pattern");
    score += 20;
  }

  if (containsAny(text, [/free\s*gift/, /claim\s*now/, /winner\s*selected/, /congratulations\s*you\s*won/])) {
    reasons.push("fake_reward_pattern");
    score += 25;
  }

  if (containsAny(text, [/crypto\s*giveaway/, /send\s*btc/, /wallet\s*address/, /investment\s*scheme/])) {
    reasons.push("crypto_scam_pattern");
    score += 35;
  }

  if (containsAny(text, [/telegram\s*link/, /whatsapp\s*number/, /dm\s*for\s*offer/])) {
    reasons.push("off_platform_contact_pattern");
    score += 20;
  }

  const flagged = score >= 40;

  return {
    signalId: String(signal.id || "unknown"),
    scamScore: score,
    flagged,
    reasons,
  };
}

export function detectScamBatch(signals: any[]): ScamDetectionResult[] {
  return (Array.isArray(signals) ? signals : []).map(detectScam);
}
