export type PhantomAccessMethod =
  | "breadcrumb"
  | "gatekeeper_pass"
  | "midnight_trigger"
  | "relic_fragment";

export type PhantomFeedAccess = {
  accessId: string;
  userId: string;
  method: PhantomAccessMethod;
  granted: boolean;
  expiresAt: number;
};

export type PhantomFeedState = {
  userId: string;
  active: boolean;
  anonymousMode: true;
  visibleMetrics: false;
  undergroundRankOnly: true;
};
