export type FypFeedRecord = {
  id: string;
  title: string;
  slug: string;
  portal: string;
  rank: number;
  score: number;
  createdAt: number;
};

export type FeedQuery = {
  limit: number;
  cursor?: string | null;
};

export type FeedResponse = {
  ok: true;
  items: FypFeedRecord[];
  nextCursor: string | null;
};
