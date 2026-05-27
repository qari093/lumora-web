import type { RushLanePost } from "./types";

export function expireRushLanePost(
  post: RushLanePost,
  now: number
): RushLanePost {
  if (now <= post.expiresAt) {
    return post;
  }

  return {
    ...post,
    active: false
  };
}

export function isRushLanePostExpired(
  post: RushLanePost,
  now: number
): boolean {
  return now > post.expiresAt || post.active === false;
}
