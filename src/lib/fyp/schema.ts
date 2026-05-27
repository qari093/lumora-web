export type LumoraContentType = "viral" | "trailer" | "fallback";

export type LumoraContentItem = {
  id: string;
  sourceId: string;
  platform: "youtube";
  type: LumoraContentType;
  title: string;
  description: string;
  thumbnailUrl: string;
  embedUrl: string;
  watchUrl: string;
  durationSeconds: number;
  publishedAt: string;
  tags: string[];
  source: {
    channelId?: string;
    channelTitle?: string;
    isVerifiedSource: boolean;
    trustScore: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    velocity: number;
  };
};

export function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
