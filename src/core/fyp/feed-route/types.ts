export interface FeedRouteQuery {
  userId: string;
  sessionId: string;
  limit: number;
}

export interface FeedRouteResult {
  ok: true;
  route: "/api/fyp/feed";
  userId: string;
  limit: number;
  status: 200;
}
