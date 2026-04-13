import type { PreViralSignal } from "./preViralSignalRegistry";

export type QuoteRepetitionSample = {
  entityId: string;
  category: PreViralSignal["category"];
  source: string;
  repeatedQuote: string;
  repetitionRate: number;
  uniqueSourceCount: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreQuoteRepetitionSample(
  sample: QuoteRepetitionSample
): number {
  const repetitionScore = clampScore(sample.repetitionRate);
  const diversityScore = clampScore(sample.uniqueSourceCount * 10);
  return clampScore(repetitionScore * 0.7 + diversityScore * 0.3);
}

export function buildQuoteRepetitionSignal(
  sample: QuoteRepetitionSample
): PreViralSignal {
  const score = scoreQuoteRepetitionSample(sample);

  return {
    id: `quote-repetition:${sample.entityId}:${sample.detectedAt}`,
    type: "quote-repetition",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.87),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      repeatedQuote: sample.repeatedQuote,
      repetitionRate: sample.repetitionRate,
      uniqueSourceCount: sample.uniqueSourceCount,
    },
  };
}

export function isStrongQuoteRepetitionSignal(
  sample: QuoteRepetitionSample
): boolean {
  return scoreQuoteRepetitionSample(sample) >= 68;
}
