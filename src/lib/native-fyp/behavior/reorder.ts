import type { NativeFypVideo } from "../schema";

export function reorderQueue(
  items: NativeFypVideo[],
  score: Record<string, number>
): NativeFypVideo[] {
  return [...items].sort((a, b) => {
    const sa = score[a.id] || 0;
    const sb = score[b.id] || 0;
    return sb - sa;
  });
}
