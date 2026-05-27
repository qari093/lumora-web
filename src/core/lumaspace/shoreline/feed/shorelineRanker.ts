import type {
  ShorelineSpark
} from "../types";

export function rankShorelineFeed(
  items: ShorelineSpark[]
): ShorelineSpark[] {
  return [...items].sort(
    (a, b) => b.rank - a.rank
  );
}
