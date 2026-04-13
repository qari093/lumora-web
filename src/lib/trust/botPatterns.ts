export type BotPatternResult = {
  signalId: string;
  botRiskScore: number;
  isBotLikely: boolean;
  reasons: string[];
};

function repeatedTokenRatio(text: string): number {
  const tokens = String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9#@]+/)
    .filter(Boolean);

  if (!tokens.length) return 0;

  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);

  let repeated = 0;
  for (const count of counts.values()) {
    if (count > 1) repeated += count;
  }

  return repeated / tokens.length;
}

export function detectBotPatterns(signal: any): BotPatternResult {
  const reasons: string[] = [];
  let score = 0;

  const title = String(signal.title || "");
  const summary = String(signal.summary || "");
  const authorHandle = String(signal.authorHandle || "");
  const hashtags = Array.isArray(signal.hashtags) ? signal.hashtags : [];
  const keywords = Array.isArray(signal.keywords) ? signal.keywords : [];

  const combined = [title, summary, ...hashtags, ...keywords].join(" ");
  const repeatRatio = repeatedTokenRatio(combined);

  if (repeatRatio > 0.45) {
    reasons.push("repeated_token_pattern");
    score += 25;
  }

  if (/([a-z0-9])\1{5,}/i.test(combined)) {
    reasons.push("character_flood_pattern");
    score += 20;
  }

  if (hashtags.length >= 15) {
    reasons.push("hashtag_stuffing");
    score += 20;
  }

  if (authorHandle && /^[a-z]+[0-9]{6,}$/i.test(authorHandle.replace(/^@/, ""))) {
    reasons.push("synthetic_handle_pattern");
    score += 15;
  }

  if (title && title === title.toUpperCase() && title.length > 24) {
    reasons.push("all_caps_shout_pattern");
    score += 10;
  }

  const isBotLikely = score >= 30;

  return {
    signalId: String(signal.id || "unknown"),
    botRiskScore: score,
    isBotLikely,
    reasons,
  };
}
