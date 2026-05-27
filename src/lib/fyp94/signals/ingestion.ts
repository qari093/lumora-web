import type { Fyp94SignalWeight } from "./types";

export function applyFyp94SignalWeightsToQueries(input: {
  baseQueries: string[];
  weights: Fyp94SignalWeight[];
  maxQueries?: number;
}): string[] {
  const max = input.maxQueries ?? 10;
  const boosted = input.weights
    .filter((weight) => weight.weight > 0)
    .flatMap((weight) => {
      const topTags = Object.entries(weight.tags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([tag]) => tag);

      return [weight.category, ...topTags].filter(Boolean);
    });

  return [...new Set([...boosted, ...input.baseQueries])].slice(0, max);
}
