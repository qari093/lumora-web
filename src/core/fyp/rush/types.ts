import type { AtmosphereMode } from "../core/types";

export type RushContentType =
  | "raw_clip"
  | "reaction"
  | "rough_edit"
  | "behind_scenes"
  | "meme_burst";

export type RushLanePost = {
  postId: string;
  creatorId: string;
  mode: AtmosphereMode;
  type: RushContentType;
  intensity: number;
  voltageSeed: number;
  createdAt: number;
  expiresAt: number;
  active: boolean;
};

export type RushLaneState = {
  creatorId: string;
  posts: RushLanePost[];
  activePostCount: number;
  monetizationEligible: boolean;
};
