import type { LumoraSignal } from "@/types/lumora.signal";

export type CoherenceAnnotatedSignal = LumoraSignal & {
  coherenceScore: number;
  coherenceReason: string;
};

function scoreTextQuality(text: string): number {
  if (!text) return 0;
  const len = text.length;
  if (len < 20) return 20;
  if (len < 80) return 50;
  if (len < 200) return 75;
  return 90;
}

function keywordConsistency(signal: LumoraSignal): number {
  const keywords = signal.keywords || [];
  const title = (signal.title || "").toLowerCase();
  if (!keywords.length) return 40;

  const matches = keywords.filter(k => title.includes(k.toLowerCase())).length;
  return Math.min(100, (matches / keywords.length) * 100);
}

function hashtagNoise(signal: LumoraSignal): number {
  const tags = signal.hashtags || [];
  if (!tags.length) return 80;
  if (tags.length > 20) return 30;
  if (tags.length > 10) return 50;
  return 90;
}

export function deriveCoherence(signal: LumoraSignal): {
  score: number;
  reason: string;
} {
  const textBlob = [
    signal.title || "",
    signal.summary || ""
  ].join(" ").trim();

  const textScore = scoreTextQuality(textBlob);
  const keywordScore = keywordConsistency(signal);
  const tagScore = hashtagNoise(signal);

  const finalScore = Math.round(
    (textScore * 0.4) +
    (keywordScore * 0.4) +
    (tagScore * 0.2)
  );

  return {
    score: finalScore,
    reason: "text_quality + keyword_consistency + hashtag_noise",
  };
}

export function annotateCoherence(signal: LumoraSignal): CoherenceAnnotatedSignal {
  const derived = deriveCoherence(signal);
  return {
    ...signal,
    coherenceScore: derived.score,
    coherenceReason: derived.reason,
  };
}

export function annotateCoherenceBatch(signals: LumoraSignal[]): CoherenceAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : []).map(annotateCoherence);
}
