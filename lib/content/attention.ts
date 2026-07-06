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
  metrics: { attentionScore?: number; velocityScore?: number } = {}
): T & { attention: { attentionScore: number; velocityScore: number } } {
  return {
    ...content,
    attention: {
      attentionScore: Math.max(0, Math.min(100, Math.round(metrics.attentionScore ?? 0))),
      velocityScore: Math.max(0, Math.min(100, Math.round(metrics.velocityScore ?? 0))),
    },
  };
}
