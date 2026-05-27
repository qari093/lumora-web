export type RealFeedSource =
  | "ugc_video"
  | "gmar_event"
  | "live_room"
  | "music_clip"
  | "movie_teaser"
  | "creator_drop"
  | "seed_content";

export type RealFeedCandidate = {
  id: string;
  source: RealFeedSource;
  creatorId: string;
  mode: string;
  intensity: number;
  trustScore: number;
  safetyScore: number;
  noveltyScore: number;
  resonanceScore: number;
  voltageScore: number;
  createdAt: number;
};

export type RankedFeedItem = RealFeedCandidate & {
  rankScore: number;
  rank: number;
};

export type ActivatedFeed = {
  userId: string;
  mode: string;
  items: RankedFeedItem[];
  activated: boolean;
  safe: boolean;
};
