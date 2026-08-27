import type { ShorelineSpark } from "../types";

type RankedShorelineSpark = ShorelineSpark & { rank?: number };

export function rankShorelineFeed(
  items: ShorelineSpark[]
): ShorelineSpark[] {
  return [...items].sort((left, right) => {
    const a = left as RankedShorelineSpark;
    const b = right as RankedShorelineSpark;
    return (b.rank ?? 0) - (a.rank ?? 0);
  });
}
