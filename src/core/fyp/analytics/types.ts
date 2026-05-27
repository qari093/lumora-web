export type AnalyticsEventName =
  | "video_impression"
  | "video_view"
  | "video_like"
  | "video_share"
  | "session_start";

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  userId: string;
  sessionId: string;
  ts: number;
  metadata: Record<string, unknown>;
};

export type AnalyticsSnapshot = {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  lastEventAt: number | null;
};

export type AnalyticsEnvelope = {
  ok: true;
  event: AnalyticsEvent;
  snapshot: AnalyticsSnapshot;
};
