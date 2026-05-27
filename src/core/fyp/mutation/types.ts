export type FeedMutationType =
  | "boost"
  | "suppress"
  | "insert"
  | "remove";

export interface FeedMutation {
  id: string;
  itemId: string;
  type: FeedMutationType;
  weight: number;
}

export interface MutatedFeedItem {
  itemId: string;
  score: number;
  removed: boolean;
}
