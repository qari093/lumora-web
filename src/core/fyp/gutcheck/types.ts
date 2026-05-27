import type { FeedItem, AtmosphereMode } from "../core/types";

export type GutCheckClip = {
  contentId: string;
  mode: AtmosphereMode;
  intensity: number;
  voltage: number;
  durationSeconds: number;
};

export type GutCheckSession = {
  sessionId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  clips: GutCheckClip[];
  completed: boolean;
};

export type GutCheckResult = {
  dominantMode: AtmosphereMode;
  emotionalSignature: string;
  adrenalineIndex: number;
  shareCardReady: boolean;
};
