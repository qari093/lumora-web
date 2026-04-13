export type MisinformationResult = {
  signalId: string;
  misinformationScore: number;
  tagged: boolean;
  tags: string[];
  reasons: string[];
};

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function detectMisinformation(signal: any): MisinformationResult {
  const text = [
    String(signal.title || ""),
    String(signal.summary || ""),
    ...(Array.isArray(signal.keywords) ? signal.keywords.map(String) : []),
    ...(Array.isArray(signal.hashtags) ? signal.hashtags.map(String) : []),
  ].join(" ").toLowerCase();

  const reasons: string[] = [];
  const tags: string[] = [];
  let score = 0;

  if (containsAny(text, [/miracle\s*cure/, /instant\s*cure/, /no\s*doctor\s*needed/, /secret\s*medicine/])) {
    reasons.push("medical_false_claim_pattern");
    tags.push("medical_misinformation");
    score += 35;
  }

  if (containsAny(text, [/stolen\s*election/, /rigged\s*votes/, /fake\s*ballots/, /vote\s*fraud\s*proof/])) {
    reasons.push("civic_misinformation_pattern");
    tags.push("civic_misinformation");
    score += 30;
  }

  if (containsAny(text, [/deepfake\s*proof/, /celebrity\s*admitted/, /government\s*coverup/, /secret\s*documents\s*confirm/])) {
    reasons.push("conspiracy_claim_pattern");
    tags.push("conspiracy_claim");
    score += 25;
  }

  if (containsAny(text, [/5g\s*causes/, /microchip\s*vaccine/, /flat\s*earth/, /chemtrails/])) {
    reasons.push("known_falsehood_pattern");
    tags.push("known_falsehood");
    score += 40;
  }

  const tagged = score >= 25;

  return {
    signalId: String(signal.id || "unknown"),
    misinformationScore: score,
    tagged,
    tags: Array.from(new Set(tags)),
    reasons,
  };
}

export function detectMisinformationBatch(signals: any[]): MisinformationResult[] {
  return (Array.isArray(signals) ? signals : []).map(detectMisinformation);
}
