export type LumoraSourcePlatform =
  | "tiktok"
  | "instagram"
  | "twitter_x"
  | "reddit"
  | "google_trends"
  | "news_rss"
  | "twitch"
  | "internal";

export type LumoraSignalLifecycle = "rising" | "peaking" | "decaying" | "archived";

export type LumoraSignalTrust = "verified" | "low_trust" | "toxic_velocity" | "pending_review";

export type LumoraEmotionTag =
  | "curiosity"
  | "humor"
  | "shock"
  | "tension"
  | "awe"
  | "anger"
  | "calm"
  | "nostalgia"
  | "joy"
  | "confusion";

export type LumoraSignal = {
  id: string;
  platform: LumoraSourcePlatform;
  title: string;
  summary?: string;
  language?: string;
  region?: string;
  keywords: string[];
  hashtags?: string[];
  url?: string;
  authorHandle?: string;
  trust: LumoraSignalTrust;
  lifecycle: LumoraSignalLifecycle;
  emotionTags: LumoraEmotionTag[];
  velocityScore: number;
  saturationScore: number;
  attentionScore: number;
  createdAt: number;
  updatedAt: number;
};
