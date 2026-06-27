export type FypAnalyticsEventName =
  | "fyp_video_started"
  | "fyp_first_interaction"
  | "fyp_swipe"
  | "fyp_swipe_back"
  | "fyp_curiosity_ring_complete"
  | "fyp_send_to_lumaspace"
  | "fyp_quality_survey";

export interface FypAnalyticsEvent {
  name: FypAnalyticsEventName;
  assetId: string;
  sessionId: string;
  ts: number;
  value?: number;
}

export function validateFypAnalyticsEvent(
  event: FypAnalyticsEvent
): boolean {
  return Boolean(
    event.name &&
    event.assetId &&
    event.sessionId &&
    Number.isFinite(event.ts) &&
    event.ts > 0
  );
}
