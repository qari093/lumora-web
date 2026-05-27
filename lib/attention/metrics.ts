export type AttentionMetric = {
  watchMs: number;
  completed: boolean;
};

export function createAttentionMetric(
  watchMs = 0
): AttentionMetric {
  return {
    watchMs,
    completed: watchMs > 10000
  };
}

export default {
  createAttentionMetric
};
