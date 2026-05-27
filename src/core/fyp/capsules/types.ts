import type { AtmosphereMode } from "../core/types";

export type CapsuleVisibility =
  | "private"
  | "shared"
  | "collaborative";

export type EmotionalTimeCapsule = {
  capsuleId: string;
  userId: string;
  title: string;
  mode: AtmosphereMode;
  visibility: CapsuleVisibility;
  contentIds: string[];
  soundtrackIds: string[];
  echoImprintIds: string[];
  culturalPulseId?: string;
  sealedAt: number;
};

export type CapsuleReplay = {
  replayId: string;
  capsuleId: string;
  userId: string;
  reconstructed: boolean;
  replayedAt: number;
};
