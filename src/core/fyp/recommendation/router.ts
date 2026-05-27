import type { FeedItem, FeedSession } from "../core/types";

export function routeFeedItems(
  items: FeedItem[],
  session: FeedSession
): FeedItem[] {
  return [...items].sort((a, b) => {
    const modeBoost =
      a.mode === session.currentMode ? 25 : 0;

    const aScore =
      (a.intensity * 10) +
      a.replayWeight +
      modeBoost;

    const bScore =
      (b.intensity * 10) +
      b.replayWeight +
      (b.mode === session.currentMode ? 25 : 0);

    return bScore - aScore;
  });
}
