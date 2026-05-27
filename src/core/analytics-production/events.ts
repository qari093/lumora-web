export type AnalyticsEventName =
  | "creator_hub_view"
  | "save_moment"
  | "subscription_created"
  | "link_opened"
  | "inbox_opened";

export function createAnalyticsEvent(input: {
  name: AnalyticsEventName;
  userId?: string;
  targetId?: string;
}) {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}
