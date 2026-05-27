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
