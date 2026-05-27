import type {
  RushContentType,
  RushLanePost,
  RushLaneState
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createRushLanePost(input: {
  postId: string;
  creatorId: string;
  mode: AtmosphereMode;
  type: RushContentType;
  intensity: number;
  voltageSeed: number;
  now?: number;
}): RushLanePost {
  if (!input.postId.trim() || !input.creatorId.trim()) {
    throw new Error("Rush Lane post requires postId and creatorId.");
  }

  if (input.intensity < 1 || input.intensity > 10) {
    throw new Error("Rush Lane intensity must be between 1 and 10.");
  }

  const now = input.now ?? Date.now();

  return {
    postId: input.postId,
    creatorId: input.creatorId,
    mode: input.mode,
    type: input.type,
    intensity: input.intensity,
    voltageSeed: input.voltageSeed,
    createdAt: now,
    expiresAt: now + 6 * 60 * 60 * 1000,
    active: true
  };
}

export function createRushLaneState(input: {
  creatorId: string;
  posts: RushLanePost[];
  now?: number;
}): RushLaneState {
  if (!input.creatorId.trim()) {
    throw new Error("Rush Lane state requires creatorId.");
  }

  const now = input.now ?? Date.now();

  const activePosts = input.posts.filter(
    post => post.active && post.expiresAt > now
  );

  return {
    creatorId: input.creatorId,
    posts: activePosts,
    activePostCount: activePosts.length,
    monetizationEligible: activePosts.some(post => post.intensity >= 7)
  };
}
