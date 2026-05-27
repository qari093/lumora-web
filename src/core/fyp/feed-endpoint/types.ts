export interface FeedEndpointRequest {
  userId: string;
  cursor: string | null;
  limit: number;
}

export interface FeedEndpointItem {
  id: string;
  rank: number;
}

export interface FeedEndpointResponse {
  ok: true;
  userId: string;
  items: FeedEndpointItem[];
  nextCursor: string | null;
}
