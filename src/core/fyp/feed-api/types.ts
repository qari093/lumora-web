export interface FeedApiRequest {
  userId: string;
  sessionId: string;
  limit: number;
  cursor: string | null;
}

export interface FeedApiItem {
  id: string;
  rank: number;
  source: string;
}

export interface FeedApiResponse {
  ok: true;
  userId: string;
  items: FeedApiItem[];
  nextCursor: string | null;
}
