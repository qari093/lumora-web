import type { AtmosphereMode } from "../core/types";

export type EchoEmotion =
  | "moved"
  | "charged"
  | "haunted"
  | "comforted"
  | "obsessed"
  | "focused"
  | "weightless";

export type EchoImprint = {
  imprintId: string;
  contentId: string;
  emotion: EchoEmotion;
  mode: AtmosphereMode;
  intensity: number;
  anonymous: boolean;
  createdAt: number;
};

export type ResonanceProfile = {
  contentId: string;
  imprintCount: number;
  replayCount: number;
  saveCount: number;
  capsuleCount: number;
  resonanceScore: number;
};
