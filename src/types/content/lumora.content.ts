export type LumoraContentType = "signal_card" | "trailer_event" | "fallback" | "reaction_echo";

export type LumoraContent = {
  id: string;
  type: LumoraContentType;
  title: string;
  summary?: string;
  createdAt: number;
  updatedAt: number;
  sourceSignalId?: string;
  sourcePlatform?: string;
  language?: string;
  region?: string;
  emotionTags?: string[];
  trustScore?: number;
  trustLevel?: "high" | "medium" | "low" | "blocked";
  saturationIndex?: number;
  attentionScore?: number;
  velocityScore?: number;
  metadata?: Record<string, unknown>;
};
