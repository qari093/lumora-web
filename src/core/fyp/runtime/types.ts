export type RuntimeMode =
  | "calm"
  | "drift"
  | "chaos"
  | "pulse";

export type RuntimeFeedItem = {
  id: string;
  emotionalWeight: number;
  category: string;
};

export type RuntimeSession = {
  sessionId: string;
  userId: string;
  mode: RuntimeMode;
  active: boolean;
  emotionalLoad: number;
  queueDepth: number;
};

export type RuntimeDecision = {
  allowed: boolean;
  nextMode: RuntimeMode;
  injectChaos: boolean;
  cooldownRecommended: boolean;
};
