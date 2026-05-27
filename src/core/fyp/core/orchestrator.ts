import type { FeedItem, FeedSession } from "./types";

import { routeFeedItems } from "../recommendation/router";

export function orchestrateFeed(
  items: FeedItem[],
  session: FeedSession
): FeedItem[] {
  const routed = routeFeedItems(items, session);

  return routed.slice(0, 25);
}
