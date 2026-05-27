export type RealtimeEventType =
  | "feed:item_view"
  | "feed:item_like"
  | "feed:item_share"
  | "feed:session_ping";

export type RealtimeEvent = {
  id: string;
  type: RealtimeEventType;
  userId: string;
  itemId?: string;
  ts: number;
  payload: Record<string, unknown>;
};

export type RealtimeEnvelope = {
  ok: true;
  channel: "fyp";
  event: RealtimeEvent;
};

export type RealtimeState = {
  connected: boolean;
  queued: number;
  delivered: number;
};
