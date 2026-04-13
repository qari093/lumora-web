import type { LumoraEmotionTag } from "@/types/lumora.signal";

export type LumoraLanguageProfile = {
  primary: string;
  secondary?: string[];
};

export type LumoraTasteProfile = {
  preferredTopics: string[];
  blockedTopics: string[];
  preferredEmotions: LumoraEmotionTag[];
  pace: "slow" | "balanced" | "fast";
};

export type LumoraUserProfile = {
  userId: string;
  language: LumoraLanguageProfile;
  taste: LumoraTasteProfile;
  personalizedMixPercent: number;
  discoveryMixPercent: number;
  reduceMotion?: boolean;
  createdAt: number;
  updatedAt: number;
};
