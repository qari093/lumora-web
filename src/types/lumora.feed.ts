import type { LumoraEmotionTag, LumoraSignalTrust, LumoraSourcePlatform } from "@/types/lumora.signal";

export type LumoraFeedCardKind =
  | "signal_frame"
  | "motion_frame"
  | "reaction_frame"
  | "video_preview"
  | "prediction"
  | "cineverse_hook"
  | "gratitude"
  | "redacted";

export type LumoraFeedCard = {
  id: string;
  kind: LumoraFeedCardKind;
  title: string;
  text?: string;
  language?: string;
  sourcePlatform?: LumoraSourcePlatform;
  trust?: LumoraSignalTrust;
  emotionTags?: LumoraEmotionTag[];
  audioUrl?: string;
  previewUrl?: string;
  posterUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  score: number;
  createdAt: number;
};
