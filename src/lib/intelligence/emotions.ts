import type { LumoraSignal, LumoraEmotionTag } from "@/types/lumora.signal";

export type EmotionAnnotatedSignal = LumoraSignal & {
  derivedEmotionTags: LumoraEmotionTag[];
  emotionReason: string;
};

const EMOTION_RULES: Array<{
  emotion: LumoraEmotionTag;
  keywords: string[];
}> = [
  { emotion: "humor", keywords: ["funny", "meme", "joke", "laugh", "comedy", "parody"] },
  { emotion: "shock", keywords: ["breaking", "explosion", "scandal", "stunned", "unbelievable", "shocking"] },
  { emotion: "tension", keywords: ["vs", "battle", "beef", "panic", "urgent", "conflict", "crash"] },
  { emotion: "awe", keywords: ["incredible", "beautiful", "amazing", "cinematic", "epic", "stunning"] },
  { emotion: "anger", keywords: ["outrage", "furious", "angry", "backlash", "boycott"] },
  { emotion: "calm", keywords: ["calm", "peaceful", "meditation", "ambient", "relax"] },
  { emotion: "nostalgia", keywords: ["throwback", "nostalgia", "classic", "retro", "anniversary"] },
  { emotion: "joy", keywords: ["celebration", "win", "victory", "joy", "happy"] },
  { emotion: "confusion", keywords: ["what is this", "confusing", "explained", "why", "mystery"] },
  { emotion: "curiosity", keywords: ["trend", "rising", "watch", "look", "discover", "signal"] },
];

function normalize(text: string): string {
  return text.toLowerCase();
}

function buildTextBlob(signal: LumoraSignal): string {
  return normalize([
    signal.title,
    signal.summary,
    ...(signal.keywords || []),
    ...(signal.hashtags || []),
  ].join(" "));
}

export function deriveEmotionTags(signal: LumoraSignal): {
  tags: LumoraEmotionTag[];
  reason: string;
} {
  const blob = buildTextBlob(signal);
  const matched: LumoraEmotionTag[] = [];

  for (const rule of EMOTION_RULES) {
    if (rule.keywords.some((keyword) => blob.includes(keyword))) {
      matched.push(rule.emotion);
    }
  }

  const unique = Array.from(new Set(matched));
  if (!unique.length) {
    return {
      tags: signal.emotionTags?.length ? signal.emotionTags : ["curiosity"],
      reason: unique.length ? "rule_match" : "fallback_existing_or_curiosity",
    };
  }

  return {
    tags: unique.slice(0, 3),
    reason: "keyword_rule_match",
  };
}

export function annotateEmotions(signal: LumoraSignal): EmotionAnnotatedSignal {
  const derived = deriveEmotionTags(signal);
  return {
    ...signal,
    derivedEmotionTags: derived.tags,
    emotionReason: derived.reason,
  };
}

export function annotateEmotionsBatch(signals: LumoraSignal[]): EmotionAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : []).map(annotateEmotions);
}
