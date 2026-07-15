import { normalizeContentSignal } from "./schema";

export function computeAttention(input: { score?: number; watchMs?: number; interactions?: number } = {}) {
  const watch = Math.max(0, input.watchMs ?? 0);
  const interactions = Math.max(0, input.interactions ?? 0);
  const base = Math.max(0, Math.min(100, input.score ?? 0));
  const attentionScore = Math.min(100, Math.round(base + watch / 1000 + interactions * 3));

  return {
    ok: true,
    attentionScore,
    signal: normalizeContentSignal({ score: attentionScore })
  };
}

export default computeAttention;


export function attachAttentionMetrics<T extends Record<string, unknown>>(
  content: T,
  metrics: {
    score?: number;
    attentionScore?: number;
    velocityScore?: number;
  } = {}
): T & {
  attention: {
    score: number;
    attentionScore: number;
    velocityScore: number;
  };
} {
  const sourceScore =
    metrics.attentionScore ??
    metrics.score ??
    (typeof content.score === "number" ? content.score : 0);

  const attentionScore = Math.max(
    0,
    Math.min(100, Math.round(sourceScore))
  );

  const velocityScore = Math.max(
    0,
    Math.min(100, Math.round(metrics.velocityScore ?? 0))
  );

  return {
    ...content,
    attention: {
      score: attentionScore,
      attentionScore,
      velocityScore,
    },
  };
}
