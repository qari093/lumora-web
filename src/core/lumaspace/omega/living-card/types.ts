export type ProfileMode = "static" | "video" | "living_card";

export type LivingCardTone =
  | "calm"
  | "creative"
  | "focused"
  | "healing"
  | "builder"
  | "guardian";

export type VideoProfileStatus =
  | "not_configured"
  | "draft"
  | "ready"
  | "disabled";

export type LivingCardAsset = {
  id: string;
  kind: "avatar" | "video" | "aura" | "memory" | "soundscape" | "mission";
  url?: string;
  label: string;
  weight: number;
};

export type LivingCardState = {
  ownerId: string;
  ownerType: "citizen" | "community" | "project" | "guardian";
  mode: ProfileMode;
  tone: LivingCardTone;
  title: string;
  openingVerse: string;
  assets: LivingCardAsset[];
  version: number;
  shareable: boolean;
  privacy: "private" | "inner_circle" | "community" | "public";
};

export type VideoProfileState = {
  ownerId: string;
  status: VideoProfileStatus;
  durationSeconds: number;
  maxDurationSeconds: 15;
  hasCaptions: boolean;
  safeForDiscovery: boolean;
  consentGranted: boolean;
};
